# Prime Pathwy Sovereign Receipt & Documentation Operating System
## Master Architecture & Implementation Blueprint

### 1. Executive Summary & Core Directives
This document outlines the complete architecture for the Prime Pathwy Sovereign Receipt & Documentation Operating System. Designed as an operational evidence platform, it guarantees audit readiness, receipt management, work-site documentation, subcontractor evidence tracking, invoice defense, compliance, business continuity, and forensic-grade archive organization.

**Core Principles:**
- **Local-First & Sovereign:** No SaaS dependencies, no cloud lock-in, no subscription APIs. All data and processing (including OCR) remain strictly local.
- **Desktop-First Architecture:** Python backend executing locally with an SQLite database and a high-authority Matte Black (#0B0B0B) and Gold (#C9A646) UI.
- **Audit-Ready:** Immutable evidence chains, checksum hashing, and append-only audit logs.

### 2. Architecture Overview
The system is built as a standalone desktop application. 

**Stack:**
- **Backend:** Python (FastAPI/Flask for internal routing if web-UI based, or PyQt/CustomTkinter for native desktop).
- **Database:** SQLite (Local-only, relational).
- **OCR Engine:** Tesseract OCR (Local execution).
- **PDF Generation:** ReportLab / WeasyPrint.
- **Search Engine:** SQLite FTS5 (Full-Text Search) combined with local indexing.

### 3. Folder Structure & Storage Root
**Storage Root:** `C:\Users\arthu\GeminiEcosystem\PrimePathwyOS\`

```text
C:\Users\arthu\GeminiEcosystem\PrimePathwyOS\
├── DATABASE/
│   ├── prime_pathwy.sqlite
│   └── backups/
├── SYSTEM/
│   ├── logs/
│   ├── audit_manifests/
│   └── temp_processing/
├── ARCHIVE/
│   └── {YEAR}/
│       └── {CLIENT}/
│           └── {WORK_ORDER}/
│               ├── RECEIPTS/
│               ├── PHOTOS/
│               ├── INVOICES/
│               ├── EXPORTS/
│               └── AUDIT/
```

### 4. Database Schema (SQLite)
The database tracks all entities with strict foreign key relationships and timestamping.

- **Receipts Table:** ID, FilePath, Vendor, Date, Amount, Tax, PaymentMethod, InvoiceNumber, Category, Notes, Checksum, UploadTimestamp.
- **WorkOrders Table:** ID, ClientID, Description, Status, CreatedAt.
- **Subcontractors Table:** ID, Name, ContactInfo.
- **Photos Table:** ID, WorkOrderID, FilePath, Timestamp, GPS_Lat, GPS_Long, SequenceType (Before/After), Checksum.
- **AuditLogs Table:** ID, EventType, EntityID, Timestamp, User, Hash.

### 5. UI/UX & Dashboard Wireframes
**Theme:** Matte Black (#0B0B0B) background with Gold (#C9A646) accents and typography. Minimalist, high-authority.

**Dashboard Sections:**
1. Receipt Intake (Drag & Drop zone)
2. Work-Site Documentation (Photo grid & sequence verification)
3. OCR Processing Queue (Status indicators)
4. Invoice Evidence Packages (Builder view)
5. Master Merged PDF Generator (One-click export)
6. Audit Archive Explorer (Tree view)
7. Search & Retrieval (Global search bar with filters)
8. Compliance Evidence Chain (Log viewer)
9. Backup Status (Health indicators)
10. System Integrity Status (Checksum verification)

### 6. OCR Pipeline Architecture
- **Input:** Images (JPG, PNG) or PDFs.
- **Preprocessing:** OpenCV (Grayscale, binarization, deskewing).
- **Extraction:** Tesseract OCR (Local).
- **Parsing:** Regex and NLP heuristics to extract Vendor, Date, Amount, Tax, Payment Method, and Invoice Number.
- **Output:** Structured JSON saved to SQLite and linked to the original file.

### 7. Master Merged PDF Engine
- **Trigger:** One-click "Master Evidence Package".
- **Assembly:** Gathers receipts, invoices, work photos, OCR summaries, and audit logs for a specific Work Order or Client.
- **Generation:** Uses ReportLab to generate an audit-ready PDF.
- **Features:** Clickable Table of Contents, indexed sections, embedded metadata, and searchable text layers.

### 8. Search Engine Architecture
- **Mechanism:** SQLite FTS5 virtual tables.
- **Indexed Fields:** Vendor, Date, Client, Amount, Invoice Number, Work Order, Subcontractor, OCR Text, Tags.
- **Execution:** Real-time local querying with sub-second response times.

### 9. Compliance & Evidence Chain
- **Hashing:** SHA-256 checksums generated for every uploaded file.
- **Audit Logs:** Append-only SQLite table tracking every upload, modification, and export.
- **Verification:** System integrity checks comparing current file hashes against database records.

### 10. Backup & Recovery Architecture
- **Local Backup:** Automated daily SQLite dumps and file archive syncing to a designated local backup drive.
- **Snapshots:** Point-in-time archive snapshots.
- **Verification:** Automated integrity checks on backup archives.

### 11. Future AI Integration Placeholders
Clean API abstraction layers (`/ai_modules/`) designed for future local models:
- AI Fraud Detection
- Duplicate Receipt Detection
- AI Categorization & Auto-Bookkeeping
- Computer Vision Validation (Photo sequence analysis)

### 12. Dependency List
- `python >= 3.10`
- `sqlite3` (Built-in)
- `pytesseract` (Tesseract OCR wrapper)
- `opencv-python` (Image preprocessing)
- `Pillow` (Image handling)
- `reportlab` or `weasyprint` (PDF generation)
- `PyMuPDF` (PDF handling)
- `fastapi` & `uvicorn` (If using a local web UI) OR `customtkinter` (If native desktop)

### 13. GitHub Repository Structure (WAT Framework)
```text
/
├── workflows/
│   └── Prime_Pathwy_Sovereign_OS_Architecture.md
├── agents/
│   └── prompts.md
├── tools/
│   ├── ocr_pipeline.py
│   ├── pdf_engine.py
│   ├── db_manager.py
│   └── search_engine.py
├── temporary/
│   └── test_data/
└── README.md
```

### 14. Installation & Deployment Guide
**Prerequisites:** Install Python 3.10+ and Tesseract OCR locally.
**Steps:**
1. Clone repository: `git clone <repo_url>`
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize Database: `python tools/db_manager.py --init`
4. Run Application: `python main.py`

### 15. Validation Contract
- **Exact Command:** `python main.py`
- **Pass Criteria:** The Matte Black and Gold dashboard loads, displaying all 10 core sections with a "System Integrity: PASS" indicator.
- **Error Map:** If Tesseract fails, ensure `tesseract.exe` is in the system PATH or explicitly defined in `ocr_pipeline.py`.
