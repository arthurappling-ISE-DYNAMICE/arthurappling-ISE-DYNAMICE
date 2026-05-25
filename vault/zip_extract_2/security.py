from fastapi import Request, HTTPException, Security
from fastapi.security import APIKeyHeader
from src.config.settings import settings

api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_local_access(request: Request):
    client_host = request.client.host
    if client_host not in ("127.0.0.1", "::1"):
        raise HTTPException(status_code=403, detail="Localhost access only")

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != settings.api_key:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key
