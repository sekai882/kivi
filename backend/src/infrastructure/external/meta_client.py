import httpx

META_GRAPH_API_URL = "https://graph.facebook.com/v18.0"

class MetaWhatsAppClient:

    async def send_whatsapp_text_message(
        self,
        to_phone: str,
        text: str,
        whatsapp_token: str,
        phone_number_id: str
    ) -> bool:
        url = f"{META_GRAPH_API_URL}/{phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {whatsapp_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to_phone,
            "type": "text",
            "text": {
                "body": text
            }
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=payload)

                if response.status_code == 200:
                    print(f"[KIVI META] Mensaje enviado exitosamente a {to_phone}")
                    return True
                else:
                    print(f"[KIVI META ERROR] Error al enviar mensaje a {to_phone}. Status: {response.status_code}. Respuesta: {response.text}")
                    return False
        except httpx.HTTPError as e:
            print(f"[KIVI META ERROR] Excepcion HTTP al enviar mensaje a {to_phone}: {e}")
            return False
        except Exception as e:
            print(f"[KIVI META ERROR] Error inesperado al enviar mensaje a {to_phone}: {e}")
            return False

# Singleton instance
meta_client = MetaWhatsAppClient()
