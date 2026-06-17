from fastapi import FastAPI
import dotenv

dotenv.load_dotenv()

from src.api.v1.endpoints import webhooks

app = FastAPI(
    title="KIVI Backend",
    description="Backend API for KIVI WhatsApp SaaS",
    version="0.1.0"
)

app.include_router(webhooks.router, prefix="/api/v1/webhook", tags=["Webhook"])

@app.get("/")
async def root():
    return {"message": "Welcome to KIVI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
