import csv
import os
import json
from datetime import datetime, timedelta

BASE = "/home/ubuntu/Prime_Pathwy"

# ─────────────────────────────────────────────────────────────────────────────
# 1. MASTER CONTENT INDEX CSV
# ─────────────────────────────────────────────────────────────────────────────
content_types = [
    ("LinkedIn_Authority", "Content_Archive/LinkedIn_Authority", "linkedin_authority", 200, "LinkedIn", "Authority Narrative", "High"),
    ("Operator_Mindset", "Content_Archive/Operator_Mindset", "operator_mindset", 100, "LinkedIn,Twitter/X", "Short-Form Mindset", "Medium"),
    ("Operational_Breakdowns", "Content_Archive/Operational_Breakdowns", "operational_breakdown", 100, "LinkedIn,Newsletter", "Operational Analysis", "High"),
    ("Newsletters", "Content_Archive/Newsletters", "newsletter", 50, "Email,Substack", "Long-Form Newsletter", "High"),
    ("Client_Education", "Content_Archive/Client_Education", "client_education", 50, "Email,LinkedIn", "Client Education", "High"),
    ("Local_Market_Insights", "Content_Archive/Local_Market_Insights", "local_market_insight", 50, "LinkedIn,Blog", "Local Market Intel", "Medium"),
    ("Whitepapers", "Whitepapers", "whitepaper", 25, "Website,Email", "Whitepaper", "High"),
    ("Founder_Narratives", "Founder_Narratives", "founder_narrative", 25, "LinkedIn,Blog", "Founder Story", "High"),
    ("Industry_Reports", "Industry_Reports", "industry_report", 25, "Website,Email,LinkedIn", "Data-Driven Report", "High"),
]

topic_tags = [
    "systems-thinking", "operational-efficiency", "AI-automation", "contractor-management",
    "compliance", "field-operations", "logistics", "leadership-framework", "execution-philosophy",
    "business-process-audit", "local-market-solano", "consulting-conversion", "authority-positioning",
    "NEPQ-persuasion", "sovereign-systems", "financial-operations", "client-management",
    "SOP-architecture", "CRM-workflows", "lead-generation", "revenue-optimization",
    "facility-management", "property-management", "industrial-services", "workforce-deployment",
    "inspection-systems", "documentation-protocols", "KPI-frameworks", "accountability-systems",
    "AI-implementation"
]

platforms = ["LinkedIn", "Email/Newsletter", "Website/Blog", "Twitter/X", "Substack", "YouTube Script"]

funnel_stages = ["Awareness", "Authority", "Consideration", "Conversion", "Retention"]

# ─────────────────────────────────────────────────────────────────────────────
# 2. BUILD MASTER CONTENT INDEX CSV
# ─────────────────────────────────────────────────────────────────────────────
master_rows = []
content_id = 1
for ct in content_types:
    name, folder, prefix, count, platform, content_type, priority = ct
    for i in range(1, count + 1):
        filename = f"{prefix}_{i:03d}.md"
        filepath = f"{folder}/{filename}"
        # Assign tags cyclically
        tag1 = topic_tags[(i - 1) % len(topic_tags)]
        tag2 = topic_tags[i % len(topic_tags)]
        funnel = funnel_stages[(i - 1) % len(funnel_stages)]
        master_rows.append({
            "content_id": f"PP-{content_id:04d}",
            "filename": filename,
            "filepath": filepath,
            "content_type": content_type,
            "platform": platform,
            "priority": priority,
            "funnel_stage": funnel,
            "tag_1": tag1,
            "tag_2": tag2,
            "word_count_estimate": 400 if "short" in content_type.lower() else 800,
            "status": "Draft",
            "publish_date": "",
            "repurpose_to": ""
        })
        content_id += 1

with open(f"{BASE}/CSV/master_content_index.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=master_rows[0].keys())
    writer.writeheader()
    writer.writerows(master_rows)
print("master_content_index.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 3. PUBLISHING CALENDAR CSV (52 weeks)
# ─────────────────────────────────────────────────────────────────────────────
start_date = datetime(2025, 6, 2)  # Start Monday
calendar_rows = []
cal_id = 1
for week in range(52):
    week_start = start_date + timedelta(weeks=week)
    # Mon: LinkedIn Authority
    calendar_rows.append({
        "week": week + 1,
        "date": (week_start).strftime("%Y-%m-%d"),
        "day": "Monday",
        "platform": "LinkedIn",
        "content_type": "LinkedIn Authority Post",
        "content_id_ref": f"PP-{(week % 200) + 1:04d}",
        "topic_tag": topic_tags[week % len(topic_tags)],
        "funnel_stage": funnel_stages[week % len(funnel_stages)],
        "notes": "Publish 8:00 AM PST"
    })
    # Wed: Operator Mindset
    calendar_rows.append({
        "week": week + 1,
        "date": (week_start + timedelta(days=2)).strftime("%Y-%m-%d"),
        "day": "Wednesday",
        "platform": "LinkedIn",
        "content_type": "Operator Mindset Post",
        "content_id_ref": f"PP-{200 + (week % 100) + 1:04d}",
        "topic_tag": topic_tags[(week + 1) % len(topic_tags)],
        "funnel_stage": funnel_stages[(week + 1) % len(funnel_stages)],
        "notes": "Publish 9:00 AM PST"
    })
    # Thu: Newsletter
    if week % 4 == 0:
        calendar_rows.append({
            "week": week + 1,
            "date": (week_start + timedelta(days=3)).strftime("%Y-%m-%d"),
            "day": "Thursday",
            "platform": "Email/Substack",
            "content_type": "Long-Form Newsletter",
            "content_id_ref": f"PP-{400 + (week // 4) % 50 + 1:04d}",
            "topic_tag": topic_tags[(week + 2) % len(topic_tags)],
            "funnel_stage": "Retention",
            "notes": "Send 7:00 AM PST"
        })
    # Fri: Operational Breakdown
    calendar_rows.append({
        "week": week + 1,
        "date": (week_start + timedelta(days=4)).strftime("%Y-%m-%d"),
        "day": "Friday",
        "platform": "LinkedIn",
        "content_type": "Operational Breakdown",
        "content_id_ref": f"PP-{300 + (week % 100) + 1:04d}",
        "topic_tag": topic_tags[(week + 3) % len(topic_tags)],
        "funnel_stage": funnel_stages[(week + 2) % len(funnel_stages)],
        "notes": "Publish 10:00 AM PST"
    })

with open(f"{BASE}/Publishing_System/Calendar/publishing_calendar_2025_2026.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=calendar_rows[0].keys())
    writer.writeheader()
    writer.writerows(calendar_rows)
print("publishing_calendar_2025_2026.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 4. TOPIC TAGGING SYSTEM CSV
# ─────────────────────────────────────────────────────────────────────────────
tag_rows = []
for i, tag in enumerate(topic_tags):
    tag_rows.append({
        "tag_id": f"TAG-{i+1:03d}",
        "tag_name": tag,
        "category": "Operations" if "operation" in tag or "logistics" in tag or "field" in tag else
                    "AI/Tech" if "AI" in tag or "CRM" in tag or "automation" in tag else
                    "Authority" if "authority" in tag or "narrative" in tag or "consulting" in tag else
                    "Finance" if "financial" in tag or "revenue" in tag else
                    "Local Market" if "solano" in tag or "local" in tag else "Systems",
        "primary_platform": "LinkedIn" if "authority" in tag or "mindset" in tag else "Email",
        "funnel_stage": "Awareness" if "local" in tag or "market" in tag else
                        "Authority" if "authority" in tag or "positioning" in tag else
                        "Conversion" if "consulting" in tag or "lead" in tag else "Consideration",
        "content_count": 0,
        "notes": f"Evergreen: {'Yes' if 'systems' in tag or 'compliance' in tag else 'No'}"
    })

with open(f"{BASE}/Publishing_System/Tags/topic_tag_system.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=tag_rows[0].keys())
    writer.writeheader()
    writer.writerows(tag_rows)
print("topic_tag_system.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 5. REPURPOSING MAP CSV
# ─────────────────────────────────────────────────────────────────────────────
repurpose_rows = [
    {"source_type": "LinkedIn Authority Post", "repurpose_to_1": "Newsletter Section", "repurpose_to_2": "Twitter/X Thread", "repurpose_to_3": "Blog Post Intro", "repurpose_to_4": "YouTube Script Segment", "notes": "Expand to 800+ words for newsletter"},
    {"source_type": "Operator Mindset Post", "repurpose_to_1": "LinkedIn Carousel Slide", "repurpose_to_2": "Email Subject Line Hook", "repurpose_to_3": "Webinar Talking Point", "repurpose_to_4": "Client Onboarding Quote", "notes": "Condense to 140 chars for X"},
    {"source_type": "Operational Breakdown", "repurpose_to_1": "Case Study PDF", "repurpose_to_2": "Whitepaper Section", "repurpose_to_3": "Proposal Appendix", "repurpose_to_4": "Training Module", "notes": "Add data tables for whitepaper"},
    {"source_type": "Newsletter", "repurpose_to_1": "LinkedIn Article", "repurpose_to_2": "Blog Post", "repurpose_to_3": "Podcast Script", "repurpose_to_4": "Lead Magnet PDF", "notes": "Split into 3-part LinkedIn series"},
    {"source_type": "Whitepaper", "repurpose_to_1": "Executive Summary PDF", "repurpose_to_2": "Webinar Deck", "repurpose_to_3": "LinkedIn Authority Series", "repurpose_to_4": "Consulting Proposal Insert", "notes": "High-value gated content"},
    {"source_type": "Founder Narrative", "repurpose_to_1": "About Page Copy", "repurpose_to_2": "Podcast Episode", "repurpose_to_3": "LinkedIn Story Post", "repurpose_to_4": "Sales Call Opening", "notes": "Core brand story asset"},
    {"source_type": "Local Market Insight", "repurpose_to_1": "Cold Outreach Email", "repurpose_to_2": "LinkedIn Local Post", "repurpose_to_3": "Proposal Market Section", "repurpose_to_4": "Chamber of Commerce Pitch", "notes": "Hyper-local targeting"},
    {"source_type": "Industry Report", "repurpose_to_1": "Press Release", "repurpose_to_2": "LinkedIn Data Post", "repurpose_to_3": "Investor Deck Slide", "repurpose_to_4": "Client Briefing Document", "notes": "Cite in all proposals"},
    {"source_type": "Client Education Sequence", "repurpose_to_1": "Drip Email Campaign", "repurpose_to_2": "Onboarding Packet", "repurpose_to_3": "FAQ Document", "repurpose_to_4": "Website Resource Page", "notes": "5-7 email sequence per segment"},
]

with open(f"{BASE}/Publishing_System/Repurposing_Maps/content_repurposing_map.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=repurpose_rows[0].keys())
    writer.writeheader()
    writer.writerows(repurpose_rows)
print("content_repurposing_map.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 6. CONVERSION FUNNEL MAP CSV
# ─────────────────────────────────────────────────────────────────────────────
funnel_rows = [
    {"stage": "Awareness", "content_types": "Local Market Insights, LinkedIn Authority Posts, Operator Mindset Posts", "platforms": "LinkedIn, Twitter/X", "goal": "Reach new decision-makers in target industries", "KPI": "Impressions, Follower Growth, Profile Views", "CTA": "Follow for operational insights", "lead_magnet": "Free Operational Audit Checklist"},
    {"stage": "Authority", "content_types": "Operational Breakdowns, Industry Reports, Whitepapers", "platforms": "LinkedIn, Email, Website", "goal": "Establish institutional credibility", "KPI": "Post Saves, Shares, Email Open Rate", "CTA": "Download the full report", "lead_magnet": "Solano County Market Intelligence Brief"},
    {"stage": "Consideration", "content_types": "Client Education Sequences, Newsletters, Founder Narratives", "platforms": "Email, LinkedIn Articles", "goal": "Nurture prospects toward consultation", "KPI": "Email Click Rate, Reply Rate, Time on Page", "CTA": "Book a 30-minute systems review", "lead_magnet": "Prime Pathwy Systems Assessment"},
    {"stage": "Conversion", "content_types": "Case Studies, Operational Breakdown Posts, Proposal Templates", "platforms": "Email, Direct Outreach, LinkedIn DM", "goal": "Convert qualified leads to $5,000+ engagements", "KPI": "Discovery Call Bookings, Proposal Sent, Close Rate", "CTA": "Schedule your Sovereign System installation", "lead_magnet": "Custom Operational Blueprint"},
    {"stage": "Retention", "content_types": "Newsletters, SOP Updates, Quarterly Reports", "platforms": "Email, Client Portal", "goal": "Retain clients and generate referrals", "KPI": "Renewal Rate, Referral Rate, NPS", "CTA": "Expand to next operational module", "lead_magnet": "Annual Operational Review Report"},
]

with open(f"{BASE}/Publishing_System/Funnel_Maps/conversion_funnel_map.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=funnel_rows[0].keys())
    writer.writeheader()
    writer.writerows(funnel_rows)
print("conversion_funnel_map.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 7. AUDIENCE SEGMENTATION CSV
# ─────────────────────────────────────────────────────────────────────────────
audience_rows = [
    {"segment_id": "SEG-001", "segment_name": "Property Managers", "industry": "Real Estate / Property Management", "geography": "Solano County, CA", "pain_points": "Contractor reliability, compliance documentation, cost overruns", "content_affinity": "Operational Breakdowns, Compliance Analysis, Local Market Insights", "outreach_channel": "LinkedIn, Cold Email", "contract_value_range": "$5,000 - $25,000/yr", "priority": "High"},
    {"segment_id": "SEG-002", "segment_name": "Logistics & Warehouse Operators", "industry": "Logistics / Warehousing", "geography": "Fairfield, Vacaville, CA", "pain_points": "Route inefficiency, workforce deployment, tech gaps", "content_affinity": "Logistics Optimization, AI Automation, Field Operations", "outreach_channel": "LinkedIn, Direct Mail", "contract_value_range": "$10,000 - $50,000/yr", "priority": "High"},
    {"segment_id": "SEG-003", "segment_name": "Commercial Contractors", "industry": "Construction / Trades", "geography": "Solano County, CA", "pain_points": "Subcontractor management, compliance, documentation", "content_affinity": "Contractor Inefficiency, SOP Architecture, Compliance", "outreach_channel": "LinkedIn, Phone", "contract_value_range": "$5,000 - $30,000/yr", "priority": "High"},
    {"segment_id": "SEG-004", "segment_name": "Municipal / Government Vendors", "industry": "Government Contracting", "geography": "Vallejo, Benicia, Fairfield, CA", "pain_points": "Bid compliance, documentation, audit readiness", "content_affinity": "Compliance Analysis, Whitepapers, Industry Reports", "outreach_channel": "RFP Responses, LinkedIn", "contract_value_range": "$25,000 - $150,000/yr", "priority": "High"},
    {"segment_id": "SEG-005", "segment_name": "Facilities Management Companies", "industry": "Facilities / Maintenance", "geography": "Solano County, CA", "pain_points": "Multi-site coordination, vendor management, reporting", "content_affinity": "Field Operations, AI Automation, Client Education", "outreach_channel": "LinkedIn, Email", "contract_value_range": "$8,000 - $40,000/yr", "priority": "Medium"},
    {"segment_id": "SEG-006", "segment_name": "HOA Management Companies", "industry": "HOA / Community Management", "geography": "American Canyon, Benicia, CA", "pain_points": "Vendor coordination, compliance, resident communication", "content_affinity": "Operational Breakdowns, Local Market Insights, Compliance", "outreach_channel": "LinkedIn, Direct Mail", "contract_value_range": "$3,000 - $15,000/yr", "priority": "Medium"},
    {"segment_id": "SEG-007", "segment_name": "Industrial Service Companies", "industry": "Industrial Services", "geography": "Vallejo, Fairfield, CA", "pain_points": "Safety compliance, equipment tracking, documentation", "content_affinity": "Compliance Analysis, SOP Architecture, Field Operations", "outreach_channel": "LinkedIn, Trade Associations", "contract_value_range": "$10,000 - $60,000/yr", "priority": "High"},
    {"segment_id": "SEG-008", "segment_name": "Fleet Service Operators", "industry": "Fleet / Transportation", "geography": "Solano County, CA", "pain_points": "Fleet tracking, maintenance scheduling, driver compliance", "content_affinity": "Logistics Optimization, AI Automation, Operational Breakdowns", "outreach_channel": "LinkedIn, Cold Email", "contract_value_range": "$5,000 - $25,000/yr", "priority": "Medium"},
]

with open(f"{BASE}/Publishing_System/Audience_Segments/audience_segmentation.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=audience_rows[0].keys())
    writer.writeheader()
    writer.writerows(audience_rows)
print("audience_segmentation.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 8. LEAD MAGNET IDEAS CSV
# ─────────────────────────────────────────────────────────────────────────────
lead_magnet_rows = [
    {"id": "LM-001", "title": "Operational Audit Checklist — Field Service Edition", "format": "PDF Checklist", "target_segment": "Property Managers, Facilities Management", "funnel_stage": "Awareness", "estimated_conversion_rate": "12-18%", "delivery_method": "Email Opt-in", "notes": "Gate with email capture on website"},
    {"id": "LM-002", "title": "Solano County Commercial Market Intelligence Brief", "format": "PDF Report", "target_segment": "All Segments", "funnel_stage": "Authority", "estimated_conversion_rate": "8-14%", "delivery_method": "LinkedIn Lead Gen Form", "notes": "High-value gated asset"},
    {"id": "LM-003", "title": "The Contractor Verification Protocol", "format": "PDF + Checklist", "target_segment": "Property Managers, HOA Companies", "funnel_stage": "Consideration", "estimated_conversion_rate": "15-22%", "delivery_method": "Email Opt-in", "notes": "Compliance-focused lead magnet"},
    {"id": "LM-004", "title": "AI Automation Readiness Assessment", "format": "Interactive PDF / Scorecard", "target_segment": "Logistics, Facilities, Industrial", "funnel_stage": "Consideration", "estimated_conversion_rate": "10-16%", "delivery_method": "Website Form", "notes": "Leads directly to discovery call"},
    {"id": "LM-005", "title": "Prime Pathwy Sovereign System Overview", "format": "Executive Deck PDF", "target_segment": "All High-Value Segments", "funnel_stage": "Conversion", "estimated_conversion_rate": "20-30%", "delivery_method": "Direct Outreach / Proposal", "notes": "Sent after discovery call"},
    {"id": "LM-006", "title": "Field Operations SOP Starter Pack", "format": "Markdown + PDF Bundle", "target_segment": "Contractors, Field Service Operators", "funnel_stage": "Authority", "estimated_conversion_rate": "10-15%", "delivery_method": "Email Opt-in", "notes": "Positions Prime Pathwy as SOP authority"},
    {"id": "LM-007", "title": "30-Day Operational Transformation Roadmap", "format": "PDF Roadmap", "target_segment": "All Segments", "funnel_stage": "Conversion", "estimated_conversion_rate": "18-25%", "delivery_method": "Discovery Call Follow-up", "notes": "Custom per client after intake"},
]

with open(f"{BASE}/Publishing_System/Funnel_Maps/lead_magnet_ideas.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=lead_magnet_rows[0].keys())
    writer.writeheader()
    writer.writerows(lead_magnet_rows)
print("lead_magnet_ideas.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 9. NEWSLETTER SEQUENCING CSV
# ─────────────────────────────────────────────────────────────────────────────
newsletter_seq_rows = []
newsletter_themes = [
    ("The Systems Imperative", "Why labor without systems creates compounding inefficiency"),
    ("The Compliance Liability Audit", "How undocumented operations expose businesses to six-figure risk"),
    ("AI in Field Operations", "Practical implementation without enterprise budgets"),
    ("The Contractor Verification Standard", "Building a vendor qualification protocol that holds up in court"),
    ("Solano County Market Intelligence", "Commercial opportunity analysis for Q3 2025"),
    ("The Operational Failure Taxonomy", "Seven categories of failure that kill profitable service businesses"),
    ("The Sovereign System Architecture", "How Prime Pathwy builds self-managing operational infrastructure"),
    ("Revenue Optimization Through Documentation", "How SOPs directly impact billing accuracy and collections"),
    ("The Field Service Automation Stack", "Tools, workflows, and logic for remote operational management"),
    ("Leadership Without Presence", "Building accountability systems that work without micromanagement"),
]
for i, (title, subtitle) in enumerate(newsletter_themes * 5):  # 50 newsletters
    seq_num = i + 1
    newsletter_seq_rows.append({
        "sequence_number": seq_num,
        "newsletter_id": f"NL-{seq_num:03d}",
        "title": title,
        "subtitle": subtitle,
        "send_week": seq_num,
        "target_segment": "All Segments" if seq_num % 3 == 0 else "High-Value Prospects",
        "funnel_stage": funnel_stages[(seq_num - 1) % len(funnel_stages)],
        "primary_cta": "Book a Systems Review" if seq_num % 5 == 0 else "Download the Full Report",
        "linked_content": f"PP-{(seq_num * 7) % 625 + 1:04d}",
        "estimated_open_rate": "28-35%",
        "notes": "Include one case study and one actionable framework per issue"
    })

with open(f"{BASE}/Publishing_System/Calendar/newsletter_sequencing.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=newsletter_seq_rows[0].keys())
    writer.writeheader()
    writer.writerows(newsletter_seq_rows)
print("newsletter_sequencing.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 10. CROSS-LINKING RECOMMENDATIONS CSV
# ─────────────────────────────────────────────────────────────────────────────
crosslink_rows = [
    {"source_content_type": "LinkedIn Authority Post", "link_to_type": "Newsletter", "link_to_id": "NL-001", "link_purpose": "Drive email list growth", "placement": "Post CTA", "notes": "Use 'Full breakdown in this week's newsletter'"},
    {"source_content_type": "Newsletter", "link_to_type": "Whitepaper", "link_to_id": "WP-001", "link_purpose": "Deepen authority, drive downloads", "placement": "Body paragraph", "notes": "Embed as gated PDF link"},
    {"source_content_type": "Operational Breakdown", "link_to_type": "Client Education Sequence", "link_to_id": "CE-001", "link_purpose": "Nurture toward consultation", "placement": "End of post", "notes": "Link to email sequence landing page"},
    {"source_content_type": "Local Market Insight", "link_to_type": "Industry Report", "link_to_id": "IR-001", "link_purpose": "Validate with data", "placement": "Body paragraph", "notes": "Cite report as source"},
    {"source_content_type": "Founder Narrative", "link_to_type": "LinkedIn Authority Post", "link_to_id": "PP-0001", "link_purpose": "Build personal brand continuity", "placement": "Author bio", "notes": "Link to most recent authority post"},
    {"source_content_type": "Whitepaper", "link_to_type": "Operational Breakdown", "link_to_id": "PP-0301", "link_purpose": "Provide tactical depth", "placement": "References section", "notes": "Link to 3 related breakdowns"},
    {"source_content_type": "Industry Report", "link_to_type": "Newsletter", "link_to_id": "NL-005", "link_purpose": "Drive newsletter subscriptions", "placement": "Report footer", "notes": "Subscribe CTA with report preview"},
]

with open(f"{BASE}/Publishing_System/Repurposing_Maps/cross_linking_recommendations.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=crosslink_rows[0].keys())
    writer.writeheader()
    writer.writerows(crosslink_rows)
print("cross_linking_recommendations.csv written.")

# ─────────────────────────────────────────────────────────────────────────────
# 11. AUTHORITY POSITIONING ARCHITECTURE MARKDOWN
# ─────────────────────────────────────────────────────────────────────────────
authority_arch = """# Prime Pathwy Authority Positioning Architecture

**Author:** Arthur F. Appling Sr., Lead Technical Architect  
**Organization:** Prime Pathwy  
**Classification:** Internal Strategic Document  
**Date:** 2025

---

## Core Positioning Statement

Prime Pathwy is the institutional-grade operational infrastructure firm for commercial service businesses, property management groups, logistics operators, and government vendors in Solano County and beyond. We do not sell labor. We install **Sovereign Systems** — self-managing operational architectures that reduce dependency on human intervention, eliminate compliance risk, and produce measurable revenue outcomes.

---

## The Three Pillars of Prime Pathwy Authority

### Pillar 1: Operational Depth
Every piece of content, every proposal, and every client interaction must demonstrate that Prime Pathwy has operated at the field level. We reference real failure modes, real compliance gaps, and real cost structures. We do not speak in abstractions.

### Pillar 2: Systems Architecture
Prime Pathwy positions itself as the firm that builds the operating system — not the firm that fills a role. Our language is architectural. We use terms like "infrastructure," "protocol," "audit trail," and "deployment logic." We never use terms like "help," "assist," or "support."

### Pillar 3: Institutional Credibility
All outputs — from LinkedIn posts to client proposals — must read as if produced by a firm with 20 years of institutional experience. Matte Black and Gold. No filler. No hype. Every claim is backed by operational logic or data.

---

## Content Hierarchy

| Tier | Content Type | Purpose | Frequency |
|------|-------------|---------|-----------|
| Tier 1 | Whitepapers, Industry Reports | Establish institutional authority | Monthly |
| Tier 2 | Newsletters, Long-Form Posts | Nurture and educate | Weekly |
| Tier 3 | LinkedIn Authority Posts | Visibility and positioning | 3x/week |
| Tier 4 | Operator Mindset Posts | Engagement and reach | Daily |
| Tier 5 | Local Market Insights | Hyper-local targeting | 2x/week |

---

## Voice and Tone Standards

- **Institutional:** Write as if addressing a board of directors or a government procurement committee.
- **Operationally Experienced:** Reference specific failure modes, cost structures, and operational logic.
- **No Hype:** Eliminate words like "revolutionary," "game-changing," "disruptive," or "transformative."
- **Actionable:** Every post must contain at least one actionable insight or framework.
- **Authoritative:** Use declarative statements. Avoid hedging language.

---

## Conversion Architecture

1. **Cold Audience** → LinkedIn Authority Posts → Profile Visit → Newsletter Subscribe
2. **Newsletter Subscriber** → Client Education Sequence → Discovery Call Booking
3. **Discovery Call** → Operational Assessment → Proposal Delivery → Sovereign System Installation
4. **Client** → Quarterly Reviews → Expansion → Referral Generation

---

## Evergreen Content Clusters

| Cluster | Core Topic | Content Count | Primary Platform |
|---------|-----------|--------------|-----------------|
| Cluster A | Systems vs. Labor | 45 pieces | LinkedIn |
| Cluster B | Compliance Architecture | 38 pieces | LinkedIn + Email |
| Cluster C | AI Field Operations | 42 pieces | LinkedIn + Website |
| Cluster D | Solano County Market Intel | 50 pieces | LinkedIn + Email |
| Cluster E | Contractor Management | 35 pieces | LinkedIn |
| Cluster F | Financial Operations | 28 pieces | Email + Website |
| Cluster G | Leadership Frameworks | 32 pieces | LinkedIn |
| Cluster H | Founder Story | 25 pieces | LinkedIn + Blog |

---

## Anti-Patterns (Prohibited)

- Generic motivational content without operational substance
- Vague claims without supporting logic or data
- Informal language or casual tone
- Competitor mentions without strategic purpose
- Content that positions Prime Pathwy as a vendor rather than an architect
"""

with open(f"{BASE}/Publishing_System/authority_positioning_architecture.md", "w") as f:
    f.write(authority_arch)
print("authority_positioning_architecture.md written.")

print("\n=== Publishing System Build Complete ===")
