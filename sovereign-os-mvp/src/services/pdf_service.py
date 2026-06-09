"""
Service: PDF Evidence Export
Purpose: Generate a formatted, audit-ready PDF report for a work order.
Dependencies: reportlab
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from typing import List, Dict


def generate_evidence_pdf(
    work_order_title: str,
    evidence_list: List[Dict],
    output_path: str,
) -> str:
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph("Prime Pathwy Sovereign OS", styles["Heading1"]))
    story.append(Paragraph("Evidence Package Report", styles["Heading2"]))
    story.append(Paragraph(f"Work Order: {work_order_title}", styles["Normal"]))
    story.append(Spacer(1, 20))

    if not evidence_list:
        story.append(Paragraph("No evidence records found for this work order.", styles["Normal"]))
    else:
        table_data = [["ID (Short)", "Filename", "MIME Type", "SHA-256 (Short)", "OCR Status"]]
        for item in evidence_list:
            table_data.append([
                item.get("id", "")[:8],
                item.get("original_filename", ""),
                item.get("mime_type", ""),
                item.get("sha256_hash", "")[:16] + "...",
                item.get("ocr_status", ""),
            ])
        t = Table(table_data, repeatRows=1)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B0B0B")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#C9A646")),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5F5F5")]),
        ]))
        story.append(t)

    doc.build(story)
    return output_path
