import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from datetime import datetime

def generate_master_pdf(work_order_id: int, output_path: str, data: dict):
    """
    Generate an audit-ready Master Evidence Package PDF.
    """
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom Styles (Matte Black & Gold Theme adapted for PDF)
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        textColor=colors.HexColor('#C9A646'), # Gold
        spaceAfter=20
    )
    
    normal_style = styles['Normal']
    
    story = []
    
    # Title
    story.append(Paragraph(f"Master Evidence Package - Work Order {work_order_id}", title_style))
    story.append(Spacer(1, 12))
    
    # Metadata
    story.append(Paragraph(f"Generated On: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    story.append(Paragraph(f"Client: {data.get('client_name', 'N/A')}", normal_style))
    story.append(Spacer(1, 20))
    
    # Receipts Summary Table
    story.append(Paragraph("Receipts Summary", styles['Heading2']))
    
    receipts_data = [['ID', 'Vendor', 'Date', 'Amount', 'Checksum']]
    for r in data.get('receipts', []):
        receipts_data.append([
            str(r.get('id', '')),
            r.get('vendor', 'N/A'),
            r.get('date', 'N/A'),
            f"${r.get('amount', 0.0):.2f}",
            r.get('checksum', '')[:10] + '...'
        ])
        
    if len(receipts_data) > 1:
        t = Table(receipts_data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0B0B0B')), # Matte Black
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#C9A646')), # Gold
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.white),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        story.append(t)
    else:
        story.append(Paragraph("No receipts found for this work order.", normal_style))
        
    story.append(Spacer(1, 20))
    
    # Audit Logs
    story.append(Paragraph("Compliance & Evidence Chain (Audit Logs)", styles['Heading2']))
    
    audit_data = [['Timestamp', 'Event', 'Entity', 'Hash']]
    for a in data.get('audit_logs', []):
        audit_data.append([
            a.get('timestamp', ''),
            a.get('event_type', ''),
            f"{a.get('entity_type')} {a.get('entity_id')}",
            a.get('hash', '')[:15] + '...'
        ])
        
    if len(audit_data) > 1:
        t2 = Table(audit_data)
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.grey)
        ]))
        story.append(t2)
        
    # Build PDF
    doc.build(story)
    return output_path
