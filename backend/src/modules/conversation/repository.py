from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.modules.conversation.models import KnowledgeBase
from typing import List

class KnowledgeBaseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_chunk(self, tenant_id: str, document_name: str, chunk_text: str, embedding: list[float]) -> KnowledgeBase:
        kb = KnowledgeBase(
            tenant_id=tenant_id,
            document_name=document_name,
            chunk_text=chunk_text,
            embedding=embedding
        )
        self.session.add(kb)
        await self.session.commit()
        await self.session.refresh(kb)
        return kb

    async def search_similar_chunks(self, tenant_id: str, query_embedding: list[float], limit: int = 5) -> List[KnowledgeBase]:
        stmt = select(KnowledgeBase)\
            .filter(KnowledgeBase.tenant_id == tenant_id)\
            .order_by(KnowledgeBase.embedding.cosine_distance(query_embedding))\
            .limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
