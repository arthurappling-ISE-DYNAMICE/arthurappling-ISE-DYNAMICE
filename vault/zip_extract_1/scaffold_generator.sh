#!/bin/bash

# Prime Pathwy Sovereign OS - Scaffold Generator
# This script creates the full folder tree and all necessary boilerplate files.

echo "Generating Prime Pathwy Sovereign OS Scaffold..."

# Define root
ROOT_DIR="prime_pathwy_os"

# Create directory structure
mkdir -p $ROOT_DIR/scripts
mkdir -p $ROOT_DIR/src/config
mkdir -p $ROOT_DIR/src/core
mkdir -p $ROOT_DIR/src/db/migrations
mkdir -p $ROOT_DIR/src/models
mkdir -p $ROOT_DIR/src/schemas
mkdir -p $ROOT_DIR/src/api/routes
mkdir -p $ROOT_DIR/src/services
mkdir -p $ROOT_DIR/src/workers
mkdir -p $ROOT_DIR/src/utils
mkdir -p $ROOT_DIR/tests
mkdir -p $ROOT_DIR/vault

# --- Root Files ---

cat << 'EOF' > $ROOT_DIR/pyproject.toml
[tool.poetry]
name = "prime-pathwy-os"
version = "0.1.0"
description = "Prime Pathwy Sovereign OS Local MVP"
authors = ["Arthur F. Appling Sr."]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
sqlalchemy = "^2.0.25"
alembic = "^1.13.1"
pydantic = "^2.5.3"
pydantic-settings = "^2.1.0"
python-multipart = "^0.0.6"
python-magic = "^0.4.27"
pytesseract = "^0.3.10"
Pillow = "^10.2.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
EOF

cat << 'EOF' > $ROOT_DIR/.env.example
ENVIRONMENT=local
API_KEY=super_secret_local_key_change_me
DATABASE_URL=sqlite+aiosqlite:///./prime_pathwy.db
VAULT_PATH=./vault
EOF

cat << 'EOF' > $ROOT_DIR/Makefile
.PHONY: run migrate test

run:
	bash scripts/run_dev.sh

migrate:
	alembic upgrade head

test:
	pytest tests/
EOF

# --- Config & Core ---

cat << 'EOF' > $ROOT_DIR/src/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str = "local"
    api_key: str
    database_url: str = "sqlite+aiosqlite:///./prime_pathwy.db"
    vault_path: str = "./vault"

    class Config:
        env_file = ".env"

settings = Settings()
EOF

cat << 'EOF' > $ROOT_DIR/src/core/security.py
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
EOF

# --- Database ---

cat << 'EOF' > $ROOT_DIR/src/db/session.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from src.config.settings import settings

engine = create_async_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False}
)

# Enable WAL mode on connect
from sqlalchemy import event
@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
EOF

cat << 'EOF' > $ROOT_DIR/src/db/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
EOF

# --- Models ---

cat << 'EOF' > $ROOT_DIR/src/models/evidence.py
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.db.base import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    original_filename = Column(String, nullable=False)
    vault_path = Column(String, nullable=False, unique=True)
    mime_type = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String, nullable=False, unique=True, index=True)
    ocr_status = Column(String, default="PENDING")
    created_at = Column(DateTime, server_default=func.now())
EOF

# --- API & Main ---

cat << 'EOF' > $ROOT_DIR/src/main.py
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
EOF

cat << 'EOF' > $ROOT_DIR/src/api/routes/evidence.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_db
from src.services.evidence_service import process_upload

router = APIRouter()

@router.post("/upload")
async def upload_evidence(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        result = await process_upload(file, db)
        return {"status": "success", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
EOF

# --- Services & Utils ---

cat << 'EOF' > $ROOT_DIR/src/services/evidence_service.py
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.file_vault import save_to_vault
from src.utils.hash_utils import calculate_hash
from src.models.evidence import Evidence

async def process_upload(file: UploadFile, db: AsyncSession):
    # 1. Read file into memory (assume small enough for MVP, or stream)
    content = await file.read()
    
    # 2. Hash it
    file_hash = calculate_hash(content)
    
    # 3. Check if exists (omitted for brevity, would query DB here)
    
    # 4. Save to vault securely
    vault_path, mime_type = save_to_vault(content, file.filename)
    
    # 5. Create DB record
    new_evidence = Evidence(
        original_filename=file.filename,
        vault_path=vault_path,
        mime_type=mime_type,
        file_size_bytes=len(content),
        sha256_hash=file_hash
    )
    db.add(new_evidence)
    await db.commit()
    await db.refresh(new_evidence)
    
    return {"id": new_evidence.id, "hash": file_hash}
EOF

cat << 'EOF' > $ROOT_DIR/src/utils/file_vault.py
import os
import uuid
import magic
from src.config.settings import settings

ALLOWED_MIMES = ["application/pdf", "image/png", "image/jpeg"]

def save_to_vault(content: bytes, original_filename: str) -> tuple[str, str]:
    # Validate MIME
    mime_type = magic.from_buffer(content[:2048], mime=True)
    if mime_type not in ALLOWED_MIMES:
        raise ValueError(f"Unsupported file type: {mime_type}")
    
    # Generate secure name
    ext = ".pdf" if mime_type == "application/pdf" else ".jpg"
    if mime_type == "image/png": ext = ".png"
    
    secure_name = f"{uuid.uuid4().hex}{ext}"
    vault_path = os.path.join(settings.vault_path, secure_name)
    
    # Ensure vault exists
    os.makedirs(settings.vault_path, exist_ok=True)
    
    # Write file
    with open(vault_path, "wb") as f:
        f.write(content)
        
    # Restrict permissions
    os.chmod(vault_path, 0o600)
    
    return vault_path, mime_type
EOF

cat << 'EOF' > $ROOT_DIR/src/utils/hash_utils.py
import hashlib

def calculate_hash(content: bytes) -> str:
    sha256 = hashlib.sha256()
    sha256.update(content)
    return sha256.hexdigest()
EOF

# --- Scripts ---

cat << 'EOF' > $ROOT_DIR/scripts/run_dev.sh
#!/bin/bash
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
EOF
chmod +x $ROOT_DIR/scripts/run_dev.sh

echo "Scaffold generated successfully in $ROOT_DIR/"
EOF
