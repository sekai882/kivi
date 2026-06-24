import logging
from src.infrastructure.database.session import get_db_session
from src.modules.tenancy.repository import TenantRepository
from src.modules.conversation.llm_agent import generate_tenant_response
from src.infrastructure.external.meta_client import meta_client

logger = logging.getLogger(__name__)

async def process_whatsapp_message(phone_number_id: str, customer_number: str, message_type: str, body: str):
    try:
        async for session in get_db_session():
            repo = TenantRepository(session)
            tenant = await repo.get_by_phone_number_id(phone_number_id)

            if not tenant:
                print(f"[KIVI LOG] Negocio no encontrado para el phone_number_id: {phone_number_id}")
                break

            print(f"[KIVI LOG] Mensaje recibido de {customer_number} para el negocio: {tenant.business_name}")

            # Only process text messages through the AI pipeline
            if message_type == "text" and body:
                ai_response = await generate_tenant_response(
                    tenant_id=tenant.id,
                    customer_phone=customer_number,
                    user_message=body
                )
                print(f"[KIVI AI ANSWER] Respuesta generada para el negocio {tenant.business_name}: {ai_response}")

                # Send AI response back to the customer via WhatsApp
                sent = await meta_client.send_whatsapp_text_message(
                    to_phone=customer_number,
                    text=ai_response,
                    whatsapp_token=tenant.whatsapp_token,
                    phone_number_id=phone_number_id
                )

                if sent:
                    print(f"[KIVI LOG] Respuesta enviada exitosamente a {customer_number}")
                else:
                    print(f"[KIVI LOG] No se pudo enviar la respuesta a {customer_number}")
            else:
                print(f"[KIVI LOG] Tipo de mensaje '{message_type}' no soportado aún para procesamiento IA.")

            break  # We only need to run this once
    except Exception as e:
        print(f"[KIVI ERROR] Error procesando mensaje de WhatsApp: {e}")
