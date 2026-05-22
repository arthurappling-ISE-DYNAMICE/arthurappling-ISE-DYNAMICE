"""
Middleware: SizeLimitMiddleware
Purpose: Reject requests exceeding the configured body size limit
         before the body is parsed, preventing DoS via large uploads.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

MAX_BODY_SIZE = 50 * 1024 * 1024  # 50MB


class SizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_BODY_SIZE:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body exceeds the 50MB size limit."},
            )
        return await call_next(request)
