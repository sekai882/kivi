from fastapi import FastAPI
import dotenv

dotenv.load_dotenv()

from src.api.v1.endpoints import webhooks
from src.api.v1.endpoints import documents
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="KIVI Backend",
    description="Backend API for KIVI WhatsApp SaaS",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhooks.router, prefix="/api/v1/webhook", tags=["Webhook"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])

@app.get("/")
async def root():
    return {"message": "Welcome to KIVI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
