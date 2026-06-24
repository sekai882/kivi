from uuid import UUID
from src.infrastructure.database.session import get_db_session
from src.modules.conversation.repository import KnowledgeBaseRepository, ConversationRepository
from src.infrastructure.external import gemini_client

SYSTEM_PROMPT_TEMPLATE = """Eres un asistente virtual de atención al cliente para un negocio. 
Tu objetivo es responder de forma amable, precisa y profesional utilizando ÚNICAMENTE la información proporcionada en el contexto a continuación.
Si no encuentras la respuesta en el contexto, indica al cliente que no tienes esa información disponible y sugiere que contacte directamente al negocio.

--- CONTEXTO DEL NEGOCIO ---
{context}
--- FIN DEL CONTEXTO ---

--- HISTORIAL DE LA CONVERSACIÓN ---
{history}
--- FIN DEL HISTORIAL ---

Responde siempre en español y de forma concisa."""

async def generate_tenant_response(tenant_id: UUID, customer_phone: str, user_message: str) -> str:
    # 1. Vectorize user message
    query_embedding = await gemini_client.get_embedding(user_message)

    # 2. Search knowledge chunks & manage conversation history
    async for session in get_db_session():
        kb_repo = KnowledgeBaseRepository(session)
        similar_chunks = await kb_repo.search_similar_chunks(
            tenant_id=str(tenant_id),
            query_embedding=query_embedding,
            limit=5
        )

        conv_repo = ConversationRepository(session)
        conversation = await conv_repo.get_or_create_conversation(str(tenant_id), customer_phone)
        
        # Save user message to history
        await conv_repo.save_message(str(conversation.id), "user", user_message)

        # Get recent history
        recent_messages = await conv_repo.get_recent_messages(str(conversation.id), limit=10)
        
        # Save the db context so we can use it to save ai response later
        # Actually it's better to save the ai response in a new session block to avoid holding it too long,
        # but for simplicity we can just do it here or reopen a session.
        # Let's just collect the data we need and break.
        conv_id = str(conversation.id)
        break

    # 3. Build dynamic system prompt with RAG context
    if similar_chunks:
        context = "\n\n".join([
            f"[{chunk.document_name}]: {chunk.chunk_text}" 
            for chunk in similar_chunks
        ])
    else:
        context = "No hay información disponible en la base de conocimientos de este negocio."

    # Format history
    history_text = "\n".join([f"{msg.role.upper()}: {msg.content}" for msg in recent_messages[:-1]]) # exclude the very last one as it is the current user_message, but maybe it's fine to include it or let the prompt handle it. Actually let's include it.
    if not history_text:
        history_text = "No hay mensajes previos."

    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context, history=history_text)

    # 4. Generate AI response
    ai_response = await gemini_client.get_chat_completion(
        system_prompt=system_prompt,
        user_message=user_message
    )

    # 5. Save AI response
    async for session in get_db_session():
        conv_repo = ConversationRepository(session)
        await conv_repo.save_message(conv_id, "ai", ai_response)
        break

    return ai_response

