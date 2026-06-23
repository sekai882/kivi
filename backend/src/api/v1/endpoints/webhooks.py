import os
import json
from fastapi import APIRouter, Request, Response, HTTPException, BackgroundTasks
from src.core.security import verify_whatsapp_signature
from src.modules.dispatching.schemas import WhatsAppWebhookPayload
from src.modules.dispatching.service import process_whatsapp_message

router = APIRouter()

META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "")
META_APP_SECRET = os.getenv("META_APP_SECRET", "")

@router.get("/")
async def verify_webhook(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == META_VERIFY_TOKEN:
        return int(challenge) if challenge else 200
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    # 1. Verify signature
    signature = request.headers.get("X-Hub-Signature-256", "")
    payload_bytes = await request.body()

    if META_APP_SECRET and not verify_whatsapp_signature(payload_bytes, signature, META_APP_SECRET):
        raise HTTPException(status_code=401, detail="Invalid signature")

    # 2. Parse payload
    try:
        payload_dict = json.loads(payload_bytes)
        payload = WhatsAppWebhookPayload(**payload_dict)
    except Exception:
        # WhatsApp expects 200 to acknowledge receipt even if parsing fails for non-message events
        return Response(content="OK", status_code=200)

    # 3. Process each message
    if payload.object == "whatsapp_business_account":
        for entry in payload.entry:
            for change in entry.changes:
                if change.value.messages:
                    phone_number_id = change.value.metadata.phone_number_id
                    for msg in change.value.messages:
                        customer_number = msg.from_
                        msg_type = msg.type
                        body = msg.text.body if msg.text else ""
                        
                        # Delegate to background task
                        background_tasks.add_task(
                            process_whatsapp_message,
                            phone_number_id=phone_number_id,
                            customer_number=customer_number,
                            message_type=msg_type,
                            body=body
                        )

    return Response(content="OK", status_code=200)
