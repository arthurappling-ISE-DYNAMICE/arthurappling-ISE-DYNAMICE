import csv
import json
import os

# Base directory
base_dir = "/home/ubuntu/PRIME_PATHWY_VAULT"

# 1. Generate Procurement Database CSV
procurement_data = [
    ["ID", "Agency", "Contract Title", "Scope", "Est Value", "Incumbent", "NAICS", "Renewal Window", "Source Portal", "Status"],
    ["P-001", "DoD (Defense Logistics Agency)", "Military Apparel Supply", "Supply of military textiles and uniforms", "$45,000,000", "Cintas Corp", "315220", "18 months", "SAM.gov", "Active"],
    ["P-002", "GSA (Public Buildings Service)", "Federal Building FM Services", "Complete facilities support services", "$12,500,000", "ABM Industries", "561210", "12 months", "SAM.gov", "Active"],
    ["P-003", "Department of Energy", "HQ Facilities Maintenance", "Facilities support and preventive maintenance", "$8,400,000", "CMI Management", "561210", "Expired (Nov 2025)", "SAM.gov", "Under Review"],
    ["P-004", "Department of State", "Global Facilities O&M", "Global facility operations and support", "$1,700,000,000", "Multi-award IDIQ", "561210", "24 months", "SAM.gov", "Active"],
    ["P-005", "National Archives (NARA)", "Records Digitization Services", "Digitization of historical paper records", "$4,200,000", "Apex Covantage", "518210", "6 months", "SAM.gov", "Active"],
    ["P-006", "Department of Veterans Affairs", "Medical Records Modernization", "AI-assisted records management and digitization", "$15,000,000", "Leidos Inc", "541512", "18 months", "SAM.gov", "Active"],
    ["P-007", "GSA (Fleet Management)", "Federal Fleet Telematics", "Fleet telematics and route optimization software", "$6,500,000", "Samsara Inc", "541511", "12 months", "SAM.gov", "Active"],
    ["P-008", "Dubai Government (GovProcurement)", "Business Consultancy Services", "Management consulting and digital transformation", "$3,500,000", "PwC Middle East", "541611", "Closing in 38 days", "eSupply", "Bidding Open"],
    ["P-009", "Singapore GovTech", "Smart Nation AI Modernization", "AI-powered process automation for public services", "$8,200,000", "NCS Group", "541512", "9 months", "GeBIZ", "Active"],
    ["P-010", "Crown Commercial Service (UK)", "SME Professional Services Framework", "Framework agreement for consulting services", "£15,000,000", "Multi-vendor", "541611", "12 months", "FTS", "Active"]
]

csv_path = os.path.join(base_dir, "temporary/procurement_database.csv")
with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(procurement_data)

# 2. Generate Contract Renewal Tracker CSV
renewal_data = [
    ["Contract ID", "Client Name", "Incumbent Vendor", "Expiration Date", "Total Value", "Sovereign Opportunity", "Action Required", "Priority"],
    ["C-101", "Prologis (US Logistics Portfolio)", "ABM Industries", "2027-06-30", "$18,500,000", "Sovereign Dispatch Engine Integration", "Initial outreach to regional operations manager", "High"],
    ["C-102", "Blackstone (Invitation Homes Portfolio)", "Regional local contractors", "2026-12-31", "$12,400,000", "Sovereign Operations Hub Deployment", "Submit capability statement for digital operations", "High"],
    ["C-103", "Equinix (Data Center Facilities)", "ISS World Services", "2027-09-30", "$24,000,000", "Sovereign Compliance Command System", "Request RFI participation via procurement portal", "Medium"],
    ["C-104", "DHL Supply Chain (US Warehouse Portfolio)", "In-house manual systems", "2026-10-31", "$8,500,000", "AI Route Optimization & Dispatch", "Present proof of concept showing 15% cost reduction", "High"],
    ["C-105", "GSA Federal Building (Atlanta)", "CMI Management", "2026-09-30", "$4,200,000", "8(a) Sole-Source Facilities O&M", "Build relationship with GSA Small Business Specialist", "High"],
    ["C-106", "VA Medical Center (Miami)", "Manual paper workflows", "2026-11-30", "$2,800,000", "Sovereign Records Digitization Module", "Submit response to active sources sought notice", "Medium"],
    ["C-107", "City of Dallas Fleet Department", "Verizon Connect", "2027-03-31", "$1,500,000", "Sovereign Fleet Telematics & AI Dispatch", "Schedule demonstration of AI dispatch capabilities", "Medium"],
    ["C-108", "Dubai Department of Enablement", "PwC Middle East", "2026-07-15", "$3,500,000", "Sovereign Management Consulting", "Submit bid response on eSupply portal", "High"]
]

csv_path = os.path.join(base_dir, "temporary/contract_renewal_tracker.csv")
with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(renewal_data)

# 3. Generate Relationship Map JSON
relationship_map = {
    "procurement_ecosystem": {
        "name": "Federal Government Procurement Ecosystem",
        "nodes": [
            {"id": "OMB", "label": "Office of Management & Budget", "group": "regulatory"},
            {"id": "FAR", "label": "FAR/DFARS Council", "group": "regulatory"},
            {"id": "SBA", "label": "Small Business Administration", "group": "regulatory"},
            {"id": "GSA", "label": "General Services Administration", "group": "agency"},
            {"id": "DoD", "label": "Department of Defense", "group": "agency"},
            {"id": "VA", "label": "Department of Veterans Affairs", "group": "agency"},
            {"id": "Prime_Pathwy", "label": "Prime Pathwy", "group": "contractor"},
            {"id": "Sovereign_Systems", "label": "Sovereign Systems", "group": "product"}
        ],
        "edges": [
            {"source": "OMB", "target": "FAR", "type": "governs"},
            {"source": "FAR", "target": "GSA", "type": "regulates"},
            {"source": "FAR", "target": "DoD", "type": "regulates"},
            {"source": "SBA", "target": "GSA", "type": "facilitates_set_asides"},
            {"source": "SBA", "target": "DoD", "type": "facilitates_set_asides"},
            {"source": "Prime_Pathwy", "target": "SBA", "type": "certified_by"},
            {"source": "Prime_Pathwy", "target": "GSA", "type": "bids_on"},
            {"source": "Prime_Pathwy", "target": "DoD", "type": "bids_on"},
            {"source": "Prime_Pathwy", "target": "Sovereign_Systems", "type": "delivers"}
        ]
    },
    "commercial_ecosystem": {
        "name": "Commercial Real Estate & Logistics Ecosystem",
        "nodes": [
            {"id": "Blackstone", "label": "Blackstone Real Estate", "group": "owner"},
            {"id": "Prologis", "label": "Prologis Inc.", "group": "owner"},
            {"id": "Equinix", "label": "Equinix Data Centers", "group": "owner"},
            {"id": "CBRE", "label": "CBRE Property Management", "group": "manager"},
            {"id": "JLL", "label": "JLL Property Management", "group": "manager"},
            {"id": "ABM", "label": "ABM Facilities Services", "group": "vendor"},
            {"id": "ISS", "label": "ISS Cleaning & FM", "group": "vendor"},
            {"id": "Prime_Pathwy", "label": "Prime Pathwy", "group": "consultant"},
            {"id": "Sovereign_Systems", "label": "Sovereign Systems", "group": "product"}
        ],
        "edges": [
            {"source": "Blackstone", "target": "CBRE", "type": "hires_manager"},
            {"source": "Prologis", "target": "JLL", "type": "hires_manager"},
            {"source": "CBRE", "target": "ABM", "type": "subcontracts"},
            {"source": "JLL", "target": "ISS", "type": "subcontracts"},
            {"source": "Prime_Pathwy", "target": "ABM", "type": "automates_operations"},
            {"source": "Prime_Pathwy", "target": "ISS", "type": "automates_operations"},
            {"source": "Prime_Pathwy", "target": "Sovereign_Systems", "type": "installs"}
        ]
    }
}

json_path = os.path.join(base_dir, "Relationship_Maps/procurement_relationship_map.json")
with open(json_path, mode="w", encoding="utf-8") as f:
    json.dump(relationship_map, f, indent=4)

print("ALL CSV AND JSON DATASETS GENERATED SUCCESSFULLY")
