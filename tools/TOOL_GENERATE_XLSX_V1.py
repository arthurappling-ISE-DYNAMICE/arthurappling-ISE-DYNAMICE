#!/usr/bin/env python3
"""
TOOL_GENERATE_XLSX_V1.py
Prime Pathwy Sovereign Intelligence Engine
Generates formatted XLSX databases from CSV datasets.
Author: Arthur F. Appling Sr.
Version: 1.0.0
"""

import os
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils.dataframe import dataframe_to_rows

# Color constants: Matte Black and Gold
MATTE_BLACK = "0B0B0B"
GOLD = "C9A646"
DARK_GRAY = "1A1A1A"
LIGHT_GRAY = "2C2C2C"
WHITE = "FFFFFF"

CSV_DIR = "/home/ubuntu/prime-pathwy-sovereign-vault/vault/phase8_datasets/csv"
XLSX_DIR = "/home/ubuntu/prime-pathwy-sovereign-vault/vault/phase8_datasets/xlsx"

def apply_header_style(ws, row_num, col_count):
    """Apply Matte Black + Gold header styling to a worksheet row."""
    for col in range(1, col_count + 1):
        cell = ws.cell(row=row_num, column=col)
        cell.fill = PatternFill(start_color=MATTE_BLACK, end_color=MATTE_BLACK, fill_type="solid")
        cell.font = Font(color=GOLD, bold=True, name="Calibri", size=11)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = Border(
            bottom=Side(style="medium", color=GOLD),
            right=Side(style="thin", color=DARK_GRAY)
        )

def apply_data_row_style(ws, row_num, col_count, is_even):
    """Apply alternating row styling to data rows."""
    bg_color = DARK_GRAY if is_even else LIGHT_GRAY
    for col in range(1, col_count + 1):
        cell = ws.cell(row=row_num, column=col)
        cell.fill = PatternFill(start_color=bg_color, end_color=bg_color, fill_type="solid")
        cell.font = Font(color=WHITE, name="Calibri", size=10)
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

def csv_to_xlsx(csv_path, xlsx_path, sheet_name):
    """Convert a CSV file to a formatted XLSX file."""
    df = pd.read_csv(csv_path)
    wb = Workbook()
    ws = wb.active
    ws.title = sheet_name

    # Set tab color to gold
    ws.sheet_properties.tabColor = GOLD

    # Write header row
    headers = list(df.columns)
    for col_num, header in enumerate(headers, 1):
        ws.cell(row=1, column=col_num, value=header.replace("_", " ").upper())

    apply_header_style(ws, 1, len(headers))

    # Write data rows
    for row_num, row_data in enumerate(dataframe_to_rows(df, index=False, header=False), 2):
        for col_num, value in enumerate(row_data, 1):
            ws.cell(row=row_num, column=col_num, value=value)
        apply_data_row_style(ws, row_num, len(headers), row_num % 2 == 0)

    # Auto-size columns
    for col in ws.columns:
        max_length = 0
        col_letter = col[0].column_letter
        for cell in col:
            if cell.value:
                max_length = max(max_length, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = min(max_length + 4, 50)

    # Freeze the header row
    ws.freeze_panes = "A2"

    # Set worksheet background
    ws.sheet_view.showGridLines = False

    wb.save(xlsx_path)
    print(f"[SUCCESS] Generated: {xlsx_path}")

def main():
    os.makedirs(XLSX_DIR, exist_ok=True)

    csv_files = {
        "procurement_intelligence.csv": "Procurement Intelligence",
        "sovereign_system_pricing_tiers.csv": "Pricing Tiers",
    }

    for csv_filename, sheet_name in csv_files.items():
        csv_path = os.path.join(CSV_DIR, csv_filename)
        xlsx_filename = csv_filename.replace(".csv", ".xlsx")
        xlsx_path = os.path.join(XLSX_DIR, xlsx_filename)

        if os.path.exists(csv_path):
            csv_to_xlsx(csv_path, xlsx_path, sheet_name)
        else:
            print(f"[WARNING] CSV not found: {csv_path}")

    print("\n[COMPLETE] All XLSX databases generated successfully.")
    print(f"Output directory: {XLSX_DIR}")

if __name__ == "__main__":
    main()
