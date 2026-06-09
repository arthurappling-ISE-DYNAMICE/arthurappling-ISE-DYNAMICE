"""
Prime Pathwy Sovereign OS — Application Entry Point
Version: 1.0.0
Author: Arthur F. Appling Sr.

Startup sequence:
1. Middleware stack applied (size limit → localhost → CORS)
2. Global dependencies applied (API key verification)
3. Routers registered under /api/v1
4. Exception handlers registered
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from src.api.routes import system, work_orders, evidence, audit, export
from src.core.security import verify_api_key
from src.core.exceptions import value_error_handler, runtime_error_handler
from src.middleware.localhost import LocalhostMiddleware
from src.middleware.size_limit import SizeLimitMiddleware
from src.core.logging import setup_logging

setup_logging()

app = FastAPI(
    title="Prime Pathwy Sovereign OS",
    version="1.0.0",
    description=(
        "Local-first, single-user, audit-grade evidence management system. "
        "Hardened uploads, SHA-256 evidence hashing, Tesseract OCR, "
        "immutable audit logs, and PDF evidence export."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    dependencies=[Depends(verify_api_key)],
)

# ── Middleware Stack (applied in reverse order of registration) ────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LocalhostMiddleware)
app.add_middleware(SizeLimitMiddleware)

# ── Exception Handlers ────────────────────────────────────────────────────────
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(RuntimeError, runtime_error_handler)

# ── Routers ───────────────────────────────────────────────────────────────────
API_V1 = "/api/v1"
app.include_router(system.router, prefix=API_V1)
app.include_router(work_orders.router, prefix=API_V1)
app.include_router(evidence.router, prefix=API_V1)
app.include_router(audit.router, prefix=API_V1)
app.include_router(export.router, prefix=API_V1)
