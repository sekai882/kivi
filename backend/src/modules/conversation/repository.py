from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.modules.conversation.models import KnowledgeBase, Conversation, Message
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

class ConversationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create_conversation(self, tenant_id: str, customer_phone: str) -> Conversation:
        stmt = select(Conversation).filter_by(tenant_id=tenant_id, customer_phone=customer_phone)
        result = await self.session.execute(stmt)
        conversation = result.scalars().first()

        if not conversation:
            conversation = Conversation(tenant_id=tenant_id, customer_phone=customer_phone)
            self.session.add(conversation)
            await self.session.commit()
            await self.session.refresh(conversation)

        return conversation

    async def save_message(self, conversation_id: str, role: str, content: str) -> Message:
        message = Message(conversation_id=conversation_id, role=role, content=content)
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def get_recent_messages(self, conversation_id: str, limit: int = 10) -> List[Message]:
        stmt = select(Message)\
            .filter_by(conversation_id=conversation_id)\
            .order_by(Message.created_at.desc())\
            .limit(limit)
        result = await self.session.execute(stmt)
        # Reverse to get chronological order
        return list(result.scalars().all())[::-1]
