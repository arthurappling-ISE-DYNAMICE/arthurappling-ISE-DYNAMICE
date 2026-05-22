from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from typing import List, Dict

def generate_evidence_pdf(evidence_list: List[Dict], output_path: str):
    """Generate a PDF evidence export report."""
    c = canvas.Canvas(output_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 750, "Prime Pathwy Sovereign OS - Evidence Report")
    c.setFont("Helvetica", 10)
    y = 720
    for item in evidence_list:
        c.drawString(72, y, f"ID: {item.get('id')}")
        c.drawString(72, y - 12, f"File: {item.get('original_filename')}")
        c.drawString(72, y - 24, f"SHA-256: {item.get('sha256_hash')}")
        c.drawString(72, y - 36, f"MIME: {item.get('mime_type')}")
        y -= 60
        if y < 100:
            c.showPage()
            y = 750
    c.save()
    return output_path
