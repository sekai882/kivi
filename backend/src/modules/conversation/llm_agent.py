from uuid import UUID
from src.infrastructure.database.session import get_db_session
from src.modules.conversation.repository import KnowledgeBaseRepository
from src.infrastructure.external import gemini_client

SYSTEM_PROMPT_TEMPLATE = """Eres un asistente virtual de atención al cliente para un negocio. 
Tu objetivo es responder de forma amable, precisa y profesional utilizando ÚNICAMENTE la información proporcionada en el contexto a continuación.
Si no encuentras la respuesta en el contexto, indica al cliente que no tienes esa información disponible y sugiere que contacte directamente al negocio.

--- CONTEXTO DEL NEGOCIO ---
{context}
--- FIN DEL CONTEXTO ---

Responde siempre en español y de forma concisa."""

async def generate_tenant_response(tenant_id: UUID, user_message: str) -> str:
    # 1. Vectorize user message
    query_embedding = await gemini_client.get_embedding(user_message)

    # 2. Search for relevant knowledge chunks filtered by tenant
    async for session in get_db_session():
        repo = KnowledgeBaseRepository(session)
        similar_chunks = await repo.search_similar_chunks(
            tenant_id=str(tenant_id),
            query_embedding=query_embedding,
            limit=5
        )
        break

    # 3. Build dynamic system prompt with RAG context
    if similar_chunks:
        context = "\n\n".join([
            f"[{chunk.document_name}]: {chunk.chunk_text}" 
            for chunk in similar_chunks
        ])
    else:
        context = "No hay información disponible en la base de conocimientos de este negocio."

    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context)

    # 4. Generate AI response
    ai_response = await gemini_client.get_chat_completion(
        system_prompt=system_prompt,
        user_message=user_message
    )

    return ai_response
