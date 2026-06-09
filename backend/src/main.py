from fastapi import FastAPI

app = FastAPI(
    title="KIVI Backend",
    description="Backend API for KIVI WhatsApp SaaS",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to KIVI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
