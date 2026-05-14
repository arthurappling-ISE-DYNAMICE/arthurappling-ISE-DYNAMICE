# Prime Pathwy Sovereign Receipt & Documentation Operating System

## Mission
Build the complete “Prime Pathwy Sovereign Receipt & Documentation Operating System.”
This is NOT a toy app. This is a long-term operational evidence platform designed for audit readiness, receipt management, work-site documentation, subcontractor evidence, invoice defense, compliance, business continuity, operational retrieval, and forensic-grade archive organization.

## Architecture
- **Backend:** Python (FastAPI)
- **Database:** SQLite (Local-only)
- **Frontend:** HTML/CSS/JS (Matte Black & Gold Theme)
- **OCR:** Tesseract (Local)
- **PDF Engine:** ReportLab

## The WAT Framework Directory Structure
- `/workflows` -> Markdown SOPs for system operation
- `/agents` -> (Prompts - Future AI Integration)
- `/tools` -> Muscle: Tesseract OCR, PDF Engine, Checksum Utils
- `/temporary` -> Scratchpad for active OCR processing
- `/app` -> Core Python source code (backend, frontend, database)
- `/data/vault` -> THE ARCHIVE (YEAR/CLIENT/WORK_ORDER structured storage)

## Setup Instructions
1. Install Python 3.10+
2. Install Tesseract OCR on your local machine and ensure it's in your PATH.
3. Install dependencies: `pip install -r requirements.txt`
4. Run the server: `python -m uvicorn app.backend.main:app --reload`
5. Access the dashboard at `http://127.0.0.1:8000`

## Validation Contract
- **Exact Command:** `python -m uvicorn app.backend.main:app --reload`
- **Pass Criteria:** Matte Black & Gold dashboard loads, displaying all core sections with a "System Integrity: PASS" indicator.
- **Error Map:** If Tesseract fails, ensure `tesseract.exe` is in the system PATH or explicitly defined in `.env` under `TESSERACT_CMD`.
