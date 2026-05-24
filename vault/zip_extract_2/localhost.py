"""
Middleware: LocalhostMiddleware
Purpose: Enforce that all requests originate from 127.0.0.1 or ::1.
         This is the network-level perimeter for the Sovereign OS.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class LocalhostMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_host = request.client.host if request.client else None
        if client_host not in ("127.0.0.1", "::1"):
            return JSONResponse(
                status_code=403,
                content={"detail": "Access restricted to localhost only."},
            )
        return await call_next(request)
