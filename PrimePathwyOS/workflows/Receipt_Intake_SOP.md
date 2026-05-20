# Standard Operating Procedure: Receipt Intake

## 1. Purpose
This document defines the strict operational workflow for processing receipts into the Prime Pathwy Sovereign OS to ensure 100% audit readiness and forensic integrity.

## 2. Scope
Applies to all physical and digital receipts, invoices, and expense documentation generated during Prime Pathwy operations.

## 3. Workflow Steps

### Step 1: Document Preparation
- Ensure physical receipts are flat and well-lit.
- For digital receipts, ensure they are in PDF or high-resolution image format (PNG/JPG).

### Step 2: System Upload
- Access the Prime Pathwy OS Dashboard (`http://127.0.0.1:8000`).
- Navigate to the **Receipt Intake** section.
- Drag and drop the files into the designated upload zone.

### Step 3: OCR Processing & Validation
- The system will automatically generate a SHA-256 checksum for the file and log the upload event.
- The local Tesseract OCR pipeline will extract: Vendor, Date, and Amount.
- **Operator Action:** Review the extracted data displayed on the dashboard. If OCR fails or is inaccurate, manually correct the fields in the database via the admin interface (feature pending UI update).

### Step 4: Archive Verification
- Verify that the receipt has been moved from the `/temporary` processing directory to the secure `/data/vault/` archive.
- Verify that the Dashboard System Integrity indicator remains **PASS (Green)**.

## 4. Error Handling
- **OCR Failure:** Ensure the image is clear. Re-upload or manually enter data.
- **System Integrity Failure:** Immediately halt operations. Run `python tools/db_manager.py --health` to verify database connection. If corrupted, restore from the latest local backup.

## 5. Validation Contract
- **Command:** N/A (UI Operation)
- **Pass Criteria:** Receipt appears in the "Recent Audit Logs" table with a valid checksum hash.
- **Error Map:** If upload hangs, check the terminal running `uvicorn` for Python traceback errors (likely missing `tesseract` executable).
