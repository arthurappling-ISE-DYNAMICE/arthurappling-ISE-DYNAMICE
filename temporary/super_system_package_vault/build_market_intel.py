import csv
import os
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

BASE = "/home/ubuntu/Prime_Pathwy"

# ─────────────────────────────────────────────────────────────────────────────
# 1. SOLANO COUNTY CRM-READY LEAD DATABASE (XLSX-equivalent CSV)
# ─────────────────────────────────────────────────────────────────────────────

sectors = [
    "Property Management", "Commercial Real Estate", "Warehousing", "Logistics",
    "Industrial Services", "Construction", "Maintenance", "Fleet Services",
    "Facilities Management", "Government Vendors", "Municipal Contractors",
    "Janitorial Companies", "Security Firms", "Waste Management",
    "Apartment Ownership Groups", "Mobile Home Parks", "HOA Management Companies",
    "Storage Facilities", "Roofing", "HVAC", "Plumbing", "Electrical",
    "Concrete", "Painting", "Asphalt", "Junk Removal", "Landscaping", "Commercial Cleaning"
]

cities = ["Vallejo", "Benicia", "Fairfield", "Vacaville", "American Canyon", "Dixon", "Rio Vista"]

pain_points_map = {
    "Property Management": "Contractor reliability, documentation gaps, compliance exposure",
    "Commercial Real Estate": "Vendor coordination, maintenance tracking, lease compliance",
    "Warehousing": "Inventory management, safety compliance, workforce deployment",
    "Logistics": "Route inefficiency, driver compliance, fleet maintenance gaps",
    "Industrial Services": "Safety documentation, equipment tracking, OSHA compliance",
    "Construction": "Subcontractor management, change order disputes, documentation",
    "Maintenance": "Scheduling inefficiency, parts procurement, technician accountability",
    "Fleet Services": "Preventive maintenance gaps, driver logs, fuel cost overruns",
    "Facilities Management": "Multi-site coordination, vendor management, reporting",
    "Government Vendors": "Bid compliance, audit readiness, documentation retention",
    "Municipal Contractors": "Public accountability, budget compliance, reporting",
    "Janitorial Companies": "Staff turnover, quality control, client retention",
    "Security Firms": "Incident documentation, patrol verification, compliance",
    "Waste Management": "Route optimization, regulatory compliance, equipment maintenance",
    "Apartment Ownership Groups": "Tenant management, maintenance coordination, compliance",
    "Mobile Home Parks": "Infrastructure maintenance, regulatory compliance, resident management",
    "HOA Management Companies": "Vendor coordination, compliance, resident communication",
    "Storage Facilities": "Security, access management, maintenance scheduling",
    "Roofing": "Project documentation, warranty management, subcontractor oversight",
    "HVAC": "Preventive maintenance scheduling, parts inventory, technician routing",
    "Plumbing": "Emergency response protocols, documentation, compliance",
    "Electrical": "Code compliance, inspection documentation, subcontractor management",
    "Concrete": "Project scheduling, material procurement, quality control",
    "Painting": "Crew management, material waste, project documentation",
    "Asphalt": "Equipment maintenance, project scheduling, material procurement",
    "Junk Removal": "Route optimization, disposal compliance, pricing accuracy",
    "Landscaping": "Crew scheduling, equipment maintenance, seasonal planning",
    "Commercial Cleaning": "Quality control, staff management, client retention",
}

contract_value_map = {
    "Property Management": "$8,000 - $35,000/yr",
    "Commercial Real Estate": "$10,000 - $50,000/yr",
    "Warehousing": "$15,000 - $75,000/yr",
    "Logistics": "$20,000 - $100,000/yr",
    "Industrial Services": "$12,000 - $60,000/yr",
    "Construction": "$10,000 - $50,000/yr",
    "Maintenance": "$5,000 - $25,000/yr",
    "Fleet Services": "$8,000 - $40,000/yr",
    "Facilities Management": "$10,000 - $50,000/yr",
    "Government Vendors": "$25,000 - $150,000/yr",
    "Municipal Contractors": "$20,000 - $100,000/yr",
    "Janitorial Companies": "$5,000 - $20,000/yr",
    "Security Firms": "$8,000 - $35,000/yr",
    "Waste Management": "$10,000 - $45,000/yr",
    "Apartment Ownership Groups": "$8,000 - $40,000/yr",
    "Mobile Home Parks": "$5,000 - $20,000/yr",
    "HOA Management Companies": "$5,000 - $25,000/yr",
    "Storage Facilities": "$5,000 - $20,000/yr",
    "Roofing": "$8,000 - $35,000/yr",
    "HVAC": "$8,000 - $40,000/yr",
    "Plumbing": "$6,000 - $30,000/yr",
    "Electrical": "$8,000 - $35,000/yr",
    "Concrete": "$6,000 - $25,000/yr",
    "Painting": "$5,000 - $20,000/yr",
    "Asphalt": "$8,000 - $35,000/yr",
    "Junk Removal": "$3,000 - $15,000/yr",
    "Landscaping": "$5,000 - $25,000/yr",
    "Commercial Cleaning": "$5,000 - $20,000/yr",
}

outreach_angle_map = {
    "Property Management": "Lead with compliance risk and contractor verification protocol",
    "Commercial Real Estate": "Lead with operational cost reduction and vendor management",
    "Warehousing": "Lead with workforce deployment and safety compliance",
    "Logistics": "Lead with route optimization and AI automation ROI",
    "Industrial Services": "Lead with OSHA compliance and documentation architecture",
    "Construction": "Lead with subcontractor management and change order protection",
    "Maintenance": "Lead with scheduling efficiency and technician accountability",
    "Fleet Services": "Lead with preventive maintenance ROI and compliance",
    "Facilities Management": "Lead with multi-site management and reporting systems",
    "Government Vendors": "Lead with audit readiness and documentation compliance",
    "Municipal Contractors": "Lead with public accountability and budget compliance",
    "Janitorial Companies": "Lead with quality control systems and staff management",
    "Security Firms": "Lead with incident documentation and patrol verification",
    "Waste Management": "Lead with route optimization and regulatory compliance",
    "Apartment Ownership Groups": "Lead with maintenance coordination and compliance",
    "Mobile Home Parks": "Lead with infrastructure management and regulatory compliance",
    "HOA Management Companies": "Lead with vendor coordination and compliance systems",
    "Storage Facilities": "Lead with security systems and maintenance scheduling",
    "Roofing": "Lead with project documentation and warranty management",
    "HVAC": "Lead with preventive maintenance scheduling and parts management",
    "Plumbing": "Lead with emergency response protocols and documentation",
    "Electrical": "Lead with code compliance and inspection documentation",
    "Concrete": "Lead with project scheduling and quality control",
    "Painting": "Lead with crew management and project documentation",
    "Asphalt": "Lead with equipment maintenance and project scheduling",
    "Junk Removal": "Lead with route optimization and pricing accuracy",
    "Landscaping": "Lead with crew scheduling and seasonal planning",
    "Commercial Cleaning": "Lead with quality control systems and client retention",
}

lead_rows = []
lead_id = 1
for sector_idx, sector in enumerate(sectors):
    for city_idx, city in enumerate(cities):
        for company_num in range(1, 4):  # 3 companies per sector per city
            lead_rows.append({
                "lead_id": f"SC-{lead_id:04d}",
                "company_name": f"[Research Required] {sector} Company {company_num} — {city}",
                "sector": sector,
                "city": city,
                "county": "Solano County",
                "state": "CA",
                "address": f"[Research Required] {city}, CA",
                "phone": "[Research Required]",
                "email": "[Research Required]",
                "website": "[Research Required]",
                "linkedin": "[Research Required]",
                "owner_name": "[Research Required]",
                "decision_maker_role": "Owner / Operations Director",
                "company_size_estimate": "5-50 employees",
                "local_footprint": "Single-location" if city_idx < 3 else "Multi-location",
                "operational_status": "Active — Verify",
                "pain_points": pain_points_map.get(sector, "Documentation, compliance, coordination"),
                "likely_subcontracting_needs": "Project management, compliance documentation, AI automation",
                "technology_weakness": "Manual processes, spreadsheet-based tracking, no CRM",
                "buying_trigger": "Compliance violation, growth phase, contractor failure, audit",
                "lead_quality_score": 8 if sector in ["Government Vendors", "Logistics", "Property Management"] else 6,
                "urgency_score": 7 if sector in ["Government Vendors", "Municipal Contractors"] else 5,
                "estimated_contract_value": contract_value_map.get(sector, "$5,000 - $25,000/yr"),
                "outreach_angle": outreach_angle_map.get(sector, "Lead with operational efficiency"),
                "best_first_contact": "LinkedIn connection + personalized message" if company_num == 1 else "Cold email with market insight attachment",
                "follow_up_cadence": "Day 1: Initial outreach | Day 4: Follow-up | Day 10: Value-add | Day 21: Check-in",
                "notes": "Verify existence and contact info before outreach",
                "status": "Uncontacted",
                "assigned_to": "Arthur F. Appling Sr.",
            })
            lead_id += 1

with open(f"{BASE}/Lead_Intelligence/Solano_County/solano_county_crm_lead_database.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=lead_rows[0].keys())
    writer.writeheader()
    writer.writerows(lead_rows)
print(f"solano_county_crm_lead_database.csv written. Total leads: {len(lead_rows)}")

# ─────────────────────────────────────────────────────────────────────────────
# 2. SECTOR OPPORTUNITY REPORT CSV
# ─────────────────────────────────────────────────────────────────────────────
sector_report_rows = []
for sector in sectors:
    sector_report_rows.append({
        "sector": sector,
        "solano_county_market_size_estimate": "Medium" if sector in ["Janitorial Companies", "Painting", "Junk Removal"] else "Large",
        "competitive_saturation": "High" if sector in ["Landscaping", "Commercial Cleaning", "Janitorial Companies"] else "Medium",
        "ai_automation_opportunity": "High" if sector in ["Logistics", "Fleet Services", "Facilities Management", "Government Vendors"] else "Medium",
        "underserved_niche": "Yes" if sector in ["Government Vendors", "Municipal Contractors", "Industrial Services", "Warehousing"] else "No",
        "recurring_revenue_potential": "High" if sector in ["Property Management", "Facilities Management", "HOA Management Companies", "Maintenance"] else "Medium",
        "prime_pathwy_fit_score": 9 if sector in ["Government Vendors", "Logistics", "Property Management", "Facilities Management"] else 7,
        "recommended_entry_strategy": "Direct outreach to decision-makers with compliance audit offer",
        "estimated_annual_revenue_opportunity": contract_value_map.get(sector, "$5,000 - $25,000/yr"),
        "notes": "Prioritize sectors with high AI automation opportunity and recurring revenue potential"
    })

with open(f"{BASE}/Lead_Intelligence/Sector_Reports/sector_opportunity_report.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=sector_report_rows[0].keys())
    writer.writeheader()
    writer.writerows(sector_report_rows)
print("sector_opportunity_report.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 3. OUTREACH STRATEGY APPENDIX CSV
# ─────────────────────────────────────────────────────────────────────────────
outreach_rows = [
    {"strategy_id": "OS-001", "strategy_name": "LinkedIn Authority Sequence", "target_segment": "Property Managers, Facilities Management", "channel": "LinkedIn", "sequence_steps": "1. Connect | 2. Value post engagement | 3. DM with market insight | 4. Discovery call invite", "timing": "Day 1, 3, 7, 14", "expected_response_rate": "12-18%", "notes": "Lead with Solano County market insight"},
    {"strategy_id": "OS-002", "strategy_name": "Cold Email Compliance Audit Offer", "target_segment": "Government Vendors, Municipal Contractors", "channel": "Email", "sequence_steps": "1. Intro email with compliance risk data | 2. Follow-up with case study | 3. Discovery call invite | 4. Final follow-up", "timing": "Day 1, 4, 10, 21", "expected_response_rate": "8-14%", "notes": "Attach Solano County Market Brief as lead magnet"},
    {"strategy_id": "OS-003", "strategy_name": "Direct Mail Operational Audit", "target_segment": "Roofing, HVAC, Plumbing, Electrical", "channel": "Direct Mail", "sequence_steps": "1. Physical mailer with audit checklist | 2. Follow-up call | 3. Email with digital version | 4. Discovery call invite", "timing": "Day 1, 7, 14, 21", "expected_response_rate": "5-10%", "notes": "High-quality print materials only"},
    {"strategy_id": "OS-004", "strategy_name": "Referral Network Activation", "target_segment": "All Segments", "channel": "Referral", "sequence_steps": "1. Identify referral partners | 2. Offer referral fee structure | 3. Provide co-branded materials | 4. Track and reward referrals", "timing": "Ongoing", "expected_response_rate": "25-40%", "notes": "Highest conversion rate channel"},
    {"strategy_id": "OS-005", "strategy_name": "Chamber of Commerce Positioning", "target_segment": "Local Businesses", "channel": "In-Person / Events", "sequence_steps": "1. Join Solano County Chamber | 2. Present at events | 3. Distribute market intelligence reports | 4. Follow up with attendees", "timing": "Monthly events", "expected_response_rate": "15-25%", "notes": "Builds local authority and network"},
]

with open(f"{BASE}/Lead_Intelligence/Outreach_Strategies/outreach_strategy_appendix.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=outreach_rows[0].keys())
    writer.writeheader()
    writer.writerows(outreach_rows)
print("outreach_strategy_appendix.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 4. GENERATE MARKET INTELLIGENCE NARRATIVE REPORTS
# ─────────────────────────────────────────────────────────────────────────────
async def generate_report(prompt, filepath):
    response = await client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are Arthur F. Appling Sr., Lead Technical Architect for Prime Pathwy. Write institutional-grade market intelligence reports for Solano County, CA. No filler. Actionable insights only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    content = response.choices[0].message.content
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Generated {filepath}")

async def generate_all_reports():
    tasks = [
        generate_report(
            "Write a Solano County Local Market Summary covering commercial real estate, logistics, industrial services, and property management. Include opportunity analysis and Prime Pathwy positioning.",
            f"{BASE}/Lead_Intelligence/Solano_County/solano_county_market_summary.md"
        ),
        generate_report(
            "Write a Sector Opportunity Report for Solano County covering the top 5 underserved niches for operational consulting. Include competitive saturation analysis and AI automation opportunities.",
            f"{BASE}/Lead_Intelligence/Sector_Reports/sector_opportunity_report.md"
        ),
        generate_report(
            "Write an Operational Inefficiency Trends report for Solano County commercial businesses. Focus on documentation gaps, compliance failures, and technology weaknesses.",
            f"{BASE}/Lead_Intelligence/Sector_Reports/operational_inefficiency_trends.md"
        ),
        generate_report(
            "Write an AI Automation Opportunity Analysis for Solano County service businesses. Focus on logistics, property management, and facilities management sectors.",
            f"{BASE}/Lead_Intelligence/Sector_Reports/ai_automation_opportunity_analysis.md"
        ),
        generate_report(
            "Write an Outreach Strategy Appendix for Prime Pathwy targeting Solano County commercial businesses. Include NEPQ-style persuasion frameworks and conversion logic.",
            f"{BASE}/Lead_Intelligence/Outreach_Strategies/outreach_strategy_appendix.md"
        ),
        generate_report(
            "Write an Acquisition Opportunity Appendix for Prime Pathwy identifying businesses in Solano County that may be acquisition targets or strategic partners.",
            f"{BASE}/Lead_Intelligence/Solano_County/acquisition_opportunity_appendix.md"
        ),
        generate_report(
            "Write a Recurring Revenue Opportunity Appendix for Prime Pathwy identifying recurring revenue streams in Solano County commercial markets.",
            f"{BASE}/Lead_Intelligence/Solano_County/recurring_revenue_opportunity_appendix.md"
        ),
    ]
    await asyncio.gather(*tasks)

asyncio.run(generate_all_reports())
print("\n=== Market Intelligence Build Complete ===")
