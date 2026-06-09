from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.tenancy.models import Tenant

class TenantRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_phone_number_id(self, phone_number_id: str) -> Tenant | None:
        stmt = select(Tenant).where(Tenant.phone_number_id == phone_number_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()
