# Standard Operating Procedure: Master Evidence Package Generation

## 1. Purpose
This document defines the process for generating an immutable, audit-ready Master Evidence Package for a specific Work Order or Client within the Prime Pathwy Sovereign OS.

## 2. Prerequisites
- All receipts, invoices, and work-site photos related to the Work Order must be uploaded and processed.
- System Integrity must read **PASS**.

## 3. Workflow Steps

### Step 1: Initialization
- Access the Prime Pathwy OS Dashboard.
- Navigate to the **Evidence Packages** section.
- Select the target Work Order ID or Client from the interface.

### Step 2: Generation
- Click **"Generate Master PDF"**.
- The system backend (`tools/pdf_engine.py`) will compile all related entities:
  - Receipts Summary (with checksums)
  - Invoice Data
  - Audit Logs (Compliance Chain)
- The PDF is styled in the high-authority Matte Black and Gold theme.

### Step 3: Verification
- Locate the generated PDF in the `/data/vault/EXPORTS/` directory (or download it directly from the UI).
- Open the PDF and verify:
  - The Title and Work Order ID are correct.
  - The Receipts Summary table is populated.
  - The Compliance & Evidence Chain table includes checksum hashes.

### Step 4: Archival
- The generated PDF is automatically hashed, and an "Export" event is written to the `AuditLogs` table to ensure an immutable record of the generation exists.

## 4. Error Handling
- **PDF Generation Fails:** Check if `reportlab` is installed (`pip install reportlab`). Ensure the database has records for the selected Work Order.

## 5. Validation Contract
- **Pass Criteria:** A `.pdf` file is successfully generated and can be opened, displaying the Matte Black and Gold styling and correct data tables.
- **Error Map:** If tables are empty, verify that receipts were properly linked to the Work Order ID during intake.
