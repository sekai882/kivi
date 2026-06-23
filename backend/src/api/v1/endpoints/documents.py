import uuid
from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.infrastructure.database.session import get_db_session
from src.modules.conversation.repository import KnowledgeBaseRepository
from src.infrastructure.external import openai_client

router = APIRouter()

@router.post("/upload")
async def upload_document(
    tenant_id: str = Form(...),
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db_session)
):
    try:
        uuid.UUID(tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tenant_id format. Must be a valid UUID.")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    
    # Very basic text chunking logic for demo purposes
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    repo = KnowledgeBaseRepository(session)
    saved_chunks = []
    
    for chunk in chunks:
        if not chunk.strip():
            continue
            
        # Generate real embedding via OpenAI
        embedding = await openai_client.get_embedding(chunk)
        kb_record = await repo.save_chunk(
            tenant_id=tenant_id,
            document_name=file.filename or "unknown",
            chunk_text=chunk,
            embedding=embedding
        )
        saved_chunks.append(kb_record.id)
        
    return {
        "status": "success",
        "message": f"Processed {len(saved_chunks)} chunks for document '{file.filename}'",
        "tenant_id": tenant_id
    }

