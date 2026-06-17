import logging
from src.infrastructure.database.session import get_db_session
from src.modules.tenancy.repository import TenantRepository

logger = logging.getLogger(__name__)

async def process_whatsapp_message(phone_number_id: str, customer_number: str, message_type: str, body: str):
    try:
        async for session in get_db_session():
            repo = TenantRepository(session)
            tenant = await repo.get_by_phone_number_id(phone_number_id)
            if tenant:
                print(f"[KIVI LOG] Mensaje recibido para el negocio: {tenant.business_name}")
            else:
                print(f"[KIVI LOG] Negocio no encontrado para el phone_number_id: {phone_number_id}")
            break  # We only need to run this once
    except Exception as e:
        print(f"Error procesando mensaje de WhatsApp: {e}")
