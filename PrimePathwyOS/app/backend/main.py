from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

from app.database.connection import get_db, init_db
from app.database import models
from tools.checksum import generate_checksum
from tools.ocr_pipeline import process_receipt
from tools.pdf_engine import generate_master_pdf

app = FastAPI(title="Prime Pathwy Sovereign OS")

# Mount frontend static files
app.mount("/static", StaticFiles(directory="app/frontend"), name="static")

@app.on_event("startup")
def on_startup():
    init_db()
    # Ensure directories exist
    os.makedirs(os.getenv("VAULT_ROOT", "./data/vault"), exist_ok=True)
    os.makedirs(os.getenv("TEMP_PROCESSING_DIR", "./temporary"), exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("app/frontend/index.html", "r") as f:
        return f.read()

@app.post("/api/upload/receipt")
async def upload_receipt(file: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_path = os.path.join(os.getenv("TEMP_PROCESSING_DIR", "./temporary"), file.filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    checksum = generate_checksum(temp_path)
    
    # Process OCR
    ocr_result = process_receipt(temp_path)
    
    # Move to vault (simplified path for now)
    vault_path = os.path.join(os.getenv("VAULT_ROOT", "./data/vault"), file.filename)
    shutil.move(temp_path, vault_path)
    
    # Save to DB
    new_receipt = models.Receipt(
        file_path=vault_path,
        vendor=ocr_result.get("vendor"),
        date=ocr_result.get("date"),
        amount=ocr_result.get("amount"),
        checksum=checksum,
        ocr_text=ocr_result.get("raw_text")
    )
    db.add(new_receipt)
    
    # Log audit
    audit_log = models.AuditLog(
        event_type="Upload",
        entity_type="Receipt",
        entity_id=0, # Will update after flush
        hash=checksum,
        details=f"Uploaded receipt {file.filename}"
    )
    db.add(audit_log)
    
    db.commit()
    db.refresh(new_receipt)
    
    audit_log.entity_id = new_receipt.id
    db.commit()
    
    return {"status": "success", "receipt_id": new_receipt.id, "ocr_data": ocr_result}

@app.get("/api/health")
def health_check():
    return {"status": "PASS", "message": "System Integrity: PASS"}
