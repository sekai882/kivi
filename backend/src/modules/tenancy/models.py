import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from src.infrastructure.database.session import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_name = Column(String, nullable=False)
    phone_number_id = Column(String, nullable=False, unique=True, index=True)
    whatsapp_token = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
