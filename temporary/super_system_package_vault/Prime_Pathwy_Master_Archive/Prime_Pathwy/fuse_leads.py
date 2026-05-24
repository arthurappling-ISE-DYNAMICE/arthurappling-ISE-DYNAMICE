"""
fuse_leads.py — Prime Pathwy Lead Fusion Engine

Merges real business contact data from the NorCal Lead Extraction CSV
into the 588-row Solano County CRM placeholder framework.

Usage: python fuse_leads.py
       (do not execute until enrichment data is verified)
"""

import csv
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import BASE_PATH, REAL_LEADS_PATH, CRM_DATABASE_PATH

OUTPUT_PATH = os.path.join(BASE_PATH, "research", "leads", "enriched_solano_crm_database.csv")

# Maps real leads industry_type values -> CRM sector names they enrich.
# Real leads file contains exactly 5 industry types (confirmed via audit):
#   Logistics Fleet, Junk Removal, Commercial Painting,
#   Industrial Painting, Painting and Coatings
SECTOR_MAP = {
    "Logistics Fleet":      ["Logistics", "Fleet Services", "Warehousing"],
    "Junk Removal":         ["Junk Removal", "Waste Management"],
    "Industrial Painting":  ["Painting", "Industrial Services"],
    "Commercial Painting":  ["Painting"],
    "Painting and Coatings": ["Painting"],
}

# Invert SECTOR_MAP: CRM sector -> list of real industry types that can fill it.
# Built at module load so the loop below never recomputes it.
CRM_SECTOR_TO_REAL = {}
for real_type, crm_sectors in SECTOR_MAP.items():
    for crm_sector in crm_sectors:
        CRM_SECTOR_TO_REAL.setdefault(crm_sector, []).append(real_type)


# ---------------------------------------------------------------------------
# PHASE 1 — Parse real leads from the NorCal extraction CSV
# ---------------------------------------------------------------------------

def parse_real_leads(filepath):
    """
    Extract business records from the NorCal lead extraction CSV.

    File format: a single-column CSV where each row stores one segment.
    Each segment's "Leads JSON" cell contains a JSON array double-CSV-escaped:
      - Array block delimiters in raw text:  ""[  ...  ]"",<lead_count>
      - JSON field quotes appear as four consecutive double-quotes:
            """"business_name"""": """"AAA Courier""""
      - CSV row-boundary quotes wrap each content line:  "    ....content...,  "

    The ,<digits> suffix after ]"" disambiguates true array endings from
    false positives caused by [verify] placeholder values inside the records.

    Strategy:
      1. Read entire file as a raw string (errors='ignore' for encoding safety).
      2. Regex-extract every JSON array block between ""[ and ]"",<n>.
      3. Unescape double CSV-quoting with two passes of replace('""', '"'):
           pass 1: """"key""""  ->  ""key""
           pass 2: ""key""     ->  "key"
      4. Strip one leading and one trailing " from each line to remove the
         CSV row-boundary quote artifacts without disturbing inner JSON quotes.
      5. Pass the cleaned array string to json.loads().
      6. Collect only the four fields needed for CRM injection.
    """
    target_fields = {"business_name", "phone", "address", "industry_type"}

    # ,\d+ anchors the end of each true array block (the lead-count CSV field).
    array_re = re.compile(r'""(\[.*?\])"",\d+', re.DOTALL)

    businesses = []

    with open(filepath, mode='r', encoding='utf-8', errors='ignore') as fh:
        raw = fh.read()

    for match in array_re.finditer(raw):
        block = match.group(1)  # captured [...]

        # Pass 1: """"key""""  ->  ""key""
        # Pass 2: ""key""     ->  "key"
        block = block.replace('""', '"')
        block = block.replace('""', '"')

        # Each content line in the raw file is wrapped in CSV row quotes:
        #   "    "key": "value","
        # After the two replace passes those outer quotes are single characters.
        # Strip exactly one leading " and one trailing " per line to remove
        # them without touching the JSON string delimiters inside the line.
        lines = []
        for line in block.splitlines():
            if line.startswith('"'):
                line = line[1:]
            if line.endswith('"'):
                line = line[:-1]
            lines.append(line)

        cleaned = '\n'.join(lines)

        try:
            segment = json.loads(cleaned)
        except json.JSONDecodeError as exc:
            print(f"  [warn] Skipping unparseable segment: {exc}")
            continue

        for record in segment:
            if isinstance(record, dict):
                entry = {k: record[k] for k in target_fields if k in record}
                if entry:
                    businesses.append(entry)

    return businesses


def build_sector_index(businesses):
    """
    Index parsed leads by industry_type for O(1) lookup during injection.

    Returns: dict[industry_type -> list[business_dict]]
    """
    index = {}
    for biz in businesses:
        itype = biz.get("industry_type", "").strip()
        if itype:
            index.setdefault(itype, []).append(biz)
    return index


# ---------------------------------------------------------------------------
# PHASE 2 — Enrich the 588-row CRM framework
# ---------------------------------------------------------------------------

def enrich_crm(crm_path, sector_index):
    """
    Load CRM placeholder rows and inject real contact data where a sector
    match exists and real leads are available.

    Injection fields:  company_name, phone, address
    Preserved fields:  all others (city, county, state, scoring, etc.)

    Returns:
        rows       — list of enriched dicts (all 588)
        fieldnames — original CSV column order
        stats      — dict with injection/skip counts
    """
    with open(crm_path, "r", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        fieldnames = reader.fieldnames
        rows = list(reader)

    # Per-industry-type pointer so we consume leads sequentially
    # across all CRM sectors that share the same real industry type.
    pointers = {}

    stats = {"injected": 0, "no_match": 0, "exhausted": 0}

    for row in rows:
        crm_sector = row.get("sector", "").strip()
        real_types = CRM_SECTOR_TO_REAL.get(crm_sector)

        if not real_types:
            stats["no_match"] += 1
            continue

        injected_this_row = False
        for real_type in real_types:
            leads = sector_index.get(real_type, [])
            idx = pointers.get(real_type, 0)

            if idx < len(leads):
                lead = leads[idx]
                row["company_name"] = lead.get("business_name", row["company_name"])
                row["phone"]        = lead.get("phone",          row["phone"])
                row["address"]      = lead.get("address",        row["address"])
                pointers[real_type] = idx + 1
                stats["injected"] += 1
                injected_this_row = True
                break  # one real lead per CRM row

        if not injected_this_row:
            stats["exhausted"] += 1

    return rows, fieldnames, stats


# ---------------------------------------------------------------------------
# PHASE 3 — Write enriched output
# ---------------------------------------------------------------------------

def write_output(rows, fieldnames, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  Prime Pathwy Lead Fusion Engine")
    print("=" * 60)
    print(f"  Source leads : {REAL_LEADS_PATH}")
    print(f"  CRM framework: {CRM_DATABASE_PATH}")
    print(f"  Output       : {OUTPUT_PATH}")
    print()

    # Phase 1 — parse
    print("[1/3] Parsing real leads...")
    businesses = parse_real_leads(REAL_LEADS_PATH)
    sector_index = build_sector_index(businesses)
    print(f"      Businesses extracted : {len(businesses)}")
    print(f"      Industry types found : {sorted(sector_index.keys())}")
    print()

    # Phase 2 — enrich
    print("[2/3] Enriching CRM framework (588 rows)...")
    rows, fieldnames, stats = enrich_crm(CRM_DATABASE_PATH, sector_index)
    print(f"      Injected             : {stats['injected']}")
    print(f"      No sector match      : {stats['no_match']}")
    print(f"      Match exhausted      : {stats['exhausted']}")
    print(f"      Total rows           : {len(rows)}")
    print()

    # Phase 3 — write
    print("[3/3] Writing enriched output...")
    write_output(rows, fieldnames, OUTPUT_PATH)
    print(f"      Written to: {OUTPUT_PATH}")
    print()
    print("=" * 60)
    print("  Fusion complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
