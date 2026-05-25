from fastapi import FastAPI, Depends
from src.api.routes import evidence
from src.core.security import verify_local_access, verify_api_key

app = FastAPI(
    title="Prime Pathwy Sovereign OS",
    dependencies=[Depends(verify_local_access), Depends(verify_api_key)]
)

app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["Evidence"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "system": "Prime Pathwy OS"}
