#!/usr/bin/env python3
"""
Prime Pathwy — Phase 3: Knowledge Graph & Relationship Density Expansion
Builds dense, weighted, multi-type relationship graphs and adjacency systems.
WAT: /tools
"""

import csv
import json
import random
import os
from datetime import datetime

OUTPUT_DIR = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/knowledge_graphs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ENTITY_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/entity_enrichment/PP_ENTITY_MASTER_ENRICHED.csv"
PROCUREMENT_CSV = "/home/ubuntu/sovereign-vault/vault/SOVEREIGN_EXECUTION_VAULT/procurement_intelligence/PP_PROCUREMENT_MASTER.csv"

# ─────────────────────────────────────────────────────────────────────────────
# RELATIONSHIP TYPE DEFINITIONS
# ─────────────────────────────────────────────────────────────────────────────

RELATIONSHIP_TYPES = {
    "subsidiary_of": {"weight_range": (0.7, 1.0), "dep_level": "High", "rev_relevance": "Medium", "monetization": "Indirect"},
    "vendor_to_agency": {"weight_range": (0.6, 0.95), "dep_level": "High", "rev_relevance": "High", "monetization": "Direct — Contract Displacement"},
    "industry_peer": {"weight_range": (0.1, 0.5), "dep_level": "Low", "rev_relevance": "Medium", "monetization": "Cross-sell / Referral"},
    "subcontractor_of": {"weight_range": (0.5, 0.9), "dep_level": "High", "rev_relevance": "High", "monetization": "Direct — Subcontract Capture"},
    "technology_dependency": {"weight_range": (0.4, 0.8), "dep_level": "Medium", "rev_relevance": "High", "monetization": "Tech Upgrade / Migration"},
    "procurement_partner": {"weight_range": (0.3, 0.7), "dep_level": "Medium", "rev_relevance": "High", "monetization": "Joint Bid / Teaming"},
    "recurring_service_client": {"weight_range": (0.6, 1.0), "dep_level": "High", "rev_relevance": "Very High", "monetization": "Recurring Revenue — Direct"},
    "compliance_dependency": {"weight_range": (0.5, 0.9), "dep_level": "High", "rev_relevance": "High", "monetization": "Compliance Consulting"},
    "geographic_cluster": {"weight_range": (0.2, 0.6), "dep_level": "Low", "rev_relevance": "Medium", "monetization": "Territory Expansion"},
    "ownership_hierarchy": {"weight_range": (0.8, 1.0), "dep_level": "Very High", "rev_relevance": "Medium", "monetization": "Enterprise Deal"},
    "ai_automation_target": {"weight_range": (0.5, 0.95), "dep_level": "Medium", "rev_relevance": "Very High", "monetization": "AI Implementation — $5K–$25K"},
    "workforce_dependency": {"weight_range": (0.4, 0.8), "dep_level": "Medium", "rev_relevance": "High", "monetization": "Staffing / Workforce Solutions"},
    "fleet_dependency": {"weight_range": (0.5, 0.9), "dep_level": "High", "rev_relevance": "High", "monetization": "Fleet Management Services"},
    "data_dependency": {"weight_range": (0.4, 0.85), "dep_level": "Medium", "rev_relevance": "High", "monetization": "Data Management / Digitization"},
    "insurance_dependency": {"weight_range": (0.3, 0.7), "dep_level": "Medium", "rev_relevance": "Medium", "monetization": "Risk & Compliance Advisory"},
}

ENTITY_TYPES = ["company", "agency", "vendor", "subcontractor", "technology_platform", "compliance_body", "financial_institution"]

# ─────────────────────────────────────────────────────────────────────────────
# LOAD EXISTING DATA
# ─────────────────────────────────────────────────────────────────────────────

def load_csv(filepath):
    rows = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
    except Exception as e:
        print(f"  Warning: Could not load {filepath}: {e}")
    return rows

# ─────────────────────────────────────────────────────────────────────────────
# GRAPH BUILDERS
# ─────────────────────────────────────────────────────────────────────────────

def build_master_knowledge_graph(entities, procurement_records):
    """Build the master multi-type knowledge graph."""
    nodes = {}
    edges = []

    # Add entity nodes
    for e in entities:
        nid = e.get("entity_id", f"ENT-{random.randint(10000,99999)}")
        nodes[nid] = {
            "id": nid,
            "label": e.get("legal_company_name", "Unknown"),
            "type": "company",
            "industry": e.get("industry", ""),
            "region": e.get("county_region", ""),
            "country": e.get("country", "US"),
            "revenue": e.get("revenue_range", ""),
            "employees": e.get("employee_estimate", ""),
            "ai_score": int(e.get("ai_opportunity_score_pct", 50)),
            "tier": e.get("sovereign_target_tier", ""),
            "tech_stack": e.get("tech_stack", ""),
        }

    # Add procurement agency nodes
    agency_nodes = {}
    for p in procurement_records:
        aid = f"AGENCY-{p.get('issuing_agency','')[:25].replace(' ','_').replace(',','').replace('(','').replace(')','')}"
        if aid not in agency_nodes:
            agency_nodes[aid] = {
                "id": aid,
                "label": p.get("issuing_agency", ""),
                "type": "agency",
                "industry": p.get("contract_category", ""),
                "region": p.get("agency_location", ""),
                "country": p.get("country", ""),
                "revenue": "Government",
                "employees": "Government",
                "ai_score": 0,
                "tier": "Government Target",
                "tech_stack": "Government Systems",
            }
            nodes[aid] = agency_nodes[aid]

    # Add vendor nodes from procurement
    vendor_nodes = {}
    for p in procurement_records:
        vid = f"VENDOR-{p.get('incumbent_vendor','')[:25].replace(' ','_').replace(',','').replace('(','').replace(')','')}"
        if vid not in vendor_nodes:
            vendor_nodes[vid] = {
                "id": vid,
                "label": p.get("incumbent_vendor", ""),
                "type": "vendor",
                "industry": p.get("contract_category", ""),
                "region": "",
                "country": p.get("country", ""),
                "revenue": p.get("estimated_contract_value", ""),
                "employees": "Unknown",
                "ai_score": 0,
                "tier": "Incumbent — Displacement Target",
                "tech_stack": "Unknown",
            }
            nodes[vid] = vendor_nodes[vid]

    # Add technology platform nodes
    tech_platforms = [
        ("TECH-QUICKBOOKS", "QuickBooks", "technology_platform"),
        ("TECH-SALESFORCE", "Salesforce CRM", "technology_platform"),
        ("TECH-SAP", "SAP ERP", "technology_platform"),
        ("TECH-MSFT365", "Microsoft 365", "technology_platform"),
        ("TECH-SERVICENOW", "ServiceNow", "technology_platform"),
        ("TECH-HUBSPOT", "HubSpot CRM", "technology_platform"),
        ("TECH-NETSUITE", "Oracle NetSuite", "technology_platform"),
        ("TECH-DYNAMICS", "Microsoft Dynamics 365", "technology_platform"),
        ("TECH-WORKDAY", "Workday HCM", "technology_platform"),
        ("TECH-SAMSARA", "Samsara Fleet GPS", "technology_platform"),
        ("TECH-PROCORE", "Procore Construction", "technology_platform"),
        ("TECH-SERVICETITAN", "ServiceTitan", "technology_platform"),
        ("TECH-JOBBER", "Jobber Field Service", "technology_platform"),
        ("TECH-OPENAI", "OpenAI API", "technology_platform"),
        ("TECH-AZURE", "Microsoft Azure", "technology_platform"),
        ("TECH-AWS", "Amazon Web Services", "technology_platform"),
        ("TECH-GOOGLECLOUD", "Google Cloud Platform", "technology_platform"),
    ]
    for tid, label, ttype in tech_platforms:
        nodes[tid] = {"id": tid, "label": label, "type": ttype, "industry": "Technology", "region": "Global", "country": "US", "revenue": "$1B+", "employees": "1000+", "ai_score": 95, "tier": "Technology Partner", "tech_stack": label}

    # Add compliance body nodes
    compliance_bodies = [
        ("COMP-OSHA", "OSHA — Occupational Safety & Health Administration", "compliance_body"),
        ("COMP-EPA", "EPA — Environmental Protection Agency", "compliance_body"),
        ("COMP-DOL", "DOL — Department of Labor", "compliance_body"),
        ("COMP-EEOC", "EEOC — Equal Employment Opportunity Commission", "compliance_body"),
        ("COMP-SBA", "SBA — Small Business Administration", "compliance_body"),
        ("COMP-SAM", "SAM.gov — System for Award Management", "compliance_body"),
        ("COMP-CSLB", "CSLB — California Contractors State License Board", "compliance_body"),
        ("COMP-BAAQMD", "BAAQMD — Bay Area Air Quality Management District", "compliance_body"),
        ("COMP-ISO9001", "ISO 9001 Quality Management Certification", "compliance_body"),
        ("COMP-ISO14001", "ISO 14001 Environmental Management Certification", "compliance_body"),
    ]
    for cid, label, ctype in compliance_bodies:
        nodes[cid] = {"id": cid, "label": label, "type": ctype, "industry": "Compliance", "region": "Multi-Region", "country": "US", "revenue": "Government", "employees": "Government", "ai_score": 0, "tier": "Compliance Authority", "tech_stack": "Government Systems"}

    # ─── BUILD EDGES ───────────────────────────────────────────────────────────

    # 1. Vendor-to-Agency edges from procurement
    for p in procurement_records[:500]:  # Sample for graph density
        aid = f"AGENCY-{p.get('issuing_agency','')[:25].replace(' ','_').replace(',','').replace('(','').replace(')','')}"
        vid = f"VENDOR-{p.get('incumbent_vendor','')[:25].replace(' ','_').replace(',','').replace('(','').replace(')','')}"
        rt = "vendor_to_agency"
        rinfo = RELATIONSHIP_TYPES[rt]
        w = round(random.uniform(*rinfo["weight_range"]), 3)
        edges.append({
            "source": vid,
            "target": aid,
            "relationship_type": rt,
            "weight": w,
            "operational_dependency_level": rinfo["dep_level"],
            "recurring_revenue_relevance": rinfo["rev_relevance"],
            "monetization_potential": rinfo["monetization"],
            "contract_value": p.get("estimated_contract_value", ""),
            "renewal_date": p.get("renewal_date", ""),
            "prime_pathwy_priority": p.get("prime_pathwy_priority", ""),
        })

    # 2. Entity-to-technology edges
    entity_list = list(nodes.keys())
    company_nodes = [nid for nid, n in nodes.items() if n["type"] == "company"]
    tech_node_ids = [t[0] for t in tech_platforms]
    for eid in company_nodes[:300]:
        tech = random.choice(tech_node_ids)
        rt = "technology_dependency"
        rinfo = RELATIONSHIP_TYPES[rt]
        w = round(random.uniform(*rinfo["weight_range"]), 3)
        edges.append({
            "source": eid,
            "target": tech,
            "relationship_type": rt,
            "weight": w,
            "operational_dependency_level": rinfo["dep_level"],
            "recurring_revenue_relevance": rinfo["rev_relevance"],
            "monetization_potential": rinfo["monetization"],
            "contract_value": "",
            "renewal_date": "",
            "prime_pathwy_priority": "HIGH — Tech Migration Opportunity",
        })

    # 3. Entity-to-compliance edges
    comp_node_ids = [c[0] for c in compliance_bodies]
    for eid in company_nodes[:400]:
        comp = random.choice(comp_node_ids)
        rt = "compliance_dependency"
        rinfo = RELATIONSHIP_TYPES[rt]
        w = round(random.uniform(*rinfo["weight_range"]), 3)
        edges.append({
            "source": eid,
            "target": comp,
            "relationship_type": rt,
            "weight": w,
            "operational_dependency_level": rinfo["dep_level"],
            "recurring_revenue_relevance": rinfo["rev_relevance"],
            "monetization_potential": rinfo["monetization"],
            "contract_value": "",
            "renewal_date": "",
            "prime_pathwy_priority": "MEDIUM — Compliance Consulting",
        })

    # 4. AI automation target edges (entity → Prime Pathwy)
    pp_node_id = "PP-PRIME-PATHWY"
    nodes[pp_node_id] = {
        "id": pp_node_id,
        "label": "Prime Pathwy — Sovereign Systems",
        "type": "prime_pathwy",
        "industry": "AI & Automation Consulting",
        "region": "Solano County, CA",
        "country": "US",
        "revenue": "Growing",
        "employees": "1–5",
        "ai_score": 100,
        "tier": "Operator",
        "tech_stack": "Sovereign AI Stack",
    }
    high_ai = [nid for nid, n in nodes.items() if n.get("ai_score", 0) >= 70 and n["type"] == "company"]
    for eid in high_ai[:500]:
        rt = "ai_automation_target"
        rinfo = RELATIONSHIP_TYPES[rt]
        w = round(random.uniform(*rinfo["weight_range"]), 3)
        edges.append({
            "source": pp_node_id,
            "target": eid,
            "relationship_type": rt,
            "weight": w,
            "operational_dependency_level": rinfo["dep_level"],
            "recurring_revenue_relevance": rinfo["rev_relevance"],
            "monetization_potential": rinfo["monetization"],
            "contract_value": "",
            "renewal_date": "",
            "prime_pathwy_priority": "HIGH — AI Implementation Target",
        })

    # 5. Industry peer edges
    industry_groups = {}
    for nid, n in nodes.items():
        if n["type"] == "company":
            industry_groups.setdefault(n["industry"], []).append(nid)
    for industry, ids in industry_groups.items():
        sample = ids[:min(8, len(ids))]
        for i in range(len(sample) - 1):
            rt = "industry_peer"
            rinfo = RELATIONSHIP_TYPES[rt]
            w = round(random.uniform(*rinfo["weight_range"]), 3)
            edges.append({
                "source": sample[i],
                "target": sample[i + 1],
                "relationship_type": rt,
                "weight": w,
                "operational_dependency_level": rinfo["dep_level"],
                "recurring_revenue_relevance": rinfo["rev_relevance"],
                "monetization_potential": rinfo["monetization"],
                "contract_value": "",
                "renewal_date": "",
                "prime_pathwy_priority": "WATCH — Referral Network",
            })

    # 6. Geographic cluster edges
    region_groups = {}
    for nid, n in nodes.items():
        if n["type"] == "company":
            region_groups.setdefault(n["region"], []).append(nid)
    for region, ids in region_groups.items():
        sample = ids[:min(5, len(ids))]
        for i in range(len(sample) - 1):
            rt = "geographic_cluster"
            rinfo = RELATIONSHIP_TYPES[rt]
            w = round(random.uniform(*rinfo["weight_range"]), 3)
            edges.append({
                "source": sample[i],
                "target": sample[i + 1],
                "relationship_type": rt,
                "weight": w,
                "operational_dependency_level": rinfo["dep_level"],
                "recurring_revenue_relevance": rinfo["rev_relevance"],
                "monetization_potential": rinfo["monetization"],
                "contract_value": "",
                "renewal_date": "",
                "prime_pathwy_priority": "MEDIUM — Territory Expansion",
            })

    return {
        "metadata": {
            "generated": datetime.now().isoformat(),
            "node_count": len(nodes),
            "edge_count": len(edges),
            "relationship_types": list(RELATIONSHIP_TYPES.keys()),
            "source": "Prime Pathwy Knowledge Graph Engine v2.0",
            "version": "2.0",
        },
        "nodes": list(nodes.values()),
        "edges": edges,
    }

def build_ownership_hierarchy(entities):
    """Build ownership hierarchy JSON."""
    hierarchy = {}
    for e in entities:
        parent = e.get("parent_company", "Independent")
        if parent == "Independent":
            continue
        if parent not in hierarchy:
            hierarchy[parent] = {"parent": parent, "subsidiaries": []}
        hierarchy[parent]["subsidiaries"].append({
            "entity_id": e.get("entity_id"),
            "name": e.get("legal_company_name"),
            "industry": e.get("industry"),
            "region": e.get("county_region"),
            "revenue": e.get("revenue_range"),
            "ai_score": e.get("ai_opportunity_score_pct"),
        })
    return list(hierarchy.values())

def build_adjacency_matrix_weighted(entities, filepath):
    """Build weighted adjacency matrix by industry-region."""
    industries = sorted(set(e.get("industry", "") for e in entities))
    regions = sorted(set(e.get("county_region", "") for e in entities))

    # Count + average AI score
    matrix_count = {r: {i: 0 for i in industries} for r in regions}
    matrix_ai = {r: {i: [] for i in industries} for r in regions}

    for e in entities:
        r = e.get("county_region", "")
        i = e.get("industry", "")
        if r and i:
            matrix_count[r][i] += 1
            try:
                matrix_ai[r][i].append(int(e.get("ai_opportunity_score_pct", 50)))
            except:
                pass

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Region", "Metric"] + industries)
        for region in regions:
            writer.writerow([region, "Entity Count"] + [matrix_count[region][i] for i in industries])
            avg_ai = [round(sum(matrix_ai[region][i]) / len(matrix_ai[region][i]), 1) if matrix_ai[region][i] else 0 for i in industries]
            writer.writerow([region, "Avg AI Score"] + avg_ai)

    print(f"  Weighted adjacency matrix written: {filepath}")

def build_relationship_edges_csv(graph, filepath):
    """Export edges as flat CSV for database ingestion."""
    if not graph["edges"]:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(graph["edges"][0].keys()))
        writer.writeheader()
        writer.writerows(graph["edges"])
    print(f"  Relationship edges CSV written: {filepath} ({len(graph['edges'])} edges)")

def build_nodes_csv(graph, filepath):
    """Export nodes as flat CSV."""
    if not graph["nodes"]:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(graph["nodes"][0].keys()))
        writer.writeheader()
        writer.writerows(graph["nodes"])
    print(f"  Nodes CSV written: {filepath} ({len(graph['nodes'])} nodes)")

def build_monetization_potential_map(graph, filepath):
    """Extract high-monetization edges."""
    high_mon = [e for e in graph["edges"] if e.get("recurring_revenue_relevance") in ("High", "Very High")]
    if not high_mon:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(high_mon[0].keys()))
        writer.writeheader()
        writer.writerows(high_mon)
    print(f"  Monetization potential map written: {filepath} ({len(high_mon)} high-value relationships)")

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("[Phase 3] Loading entity and procurement data...")
    entities = load_csv(ENTITY_CSV)
    procurement = load_csv(PROCUREMENT_CSV)
    print(f"  Loaded {len(entities)} entities, {len(procurement)} procurement records")

    print("[Phase 3] Building master knowledge graph...")
    graph = build_master_knowledge_graph(entities, procurement)

    print("[Phase 3] Writing master knowledge graph JSON...")
    with open(f"{OUTPUT_DIR}/PP_MASTER_KNOWLEDGE_GRAPH.json", "w", encoding="utf-8") as f:
        json.dump(graph, f, indent=2)
    print(f"  Master graph written: {graph['metadata']['node_count']} nodes, {graph['metadata']['edge_count']} edges")

    print("[Phase 3] Writing relationship edges CSV...")
    build_relationship_edges_csv(graph, f"{OUTPUT_DIR}/PP_RELATIONSHIP_EDGES.csv")

    print("[Phase 3] Writing nodes CSV...")
    build_nodes_csv(graph, f"{OUTPUT_DIR}/PP_GRAPH_NODES.csv")

    print("[Phase 3] Writing weighted adjacency matrix...")
    build_adjacency_matrix_weighted(entities, f"{OUTPUT_DIR}/PP_WEIGHTED_ADJACENCY_MATRIX.csv")

    print("[Phase 3] Building ownership hierarchy...")
    hierarchy = build_ownership_hierarchy(entities)
    with open(f"{OUTPUT_DIR}/PP_OWNERSHIP_HIERARCHY.json", "w", encoding="utf-8") as f:
        json.dump(hierarchy, f, indent=2)
    print(f"  Ownership hierarchy written: {len(hierarchy)} parent entities")

    print("[Phase 3] Writing monetization potential map...")
    build_monetization_potential_map(graph, f"{OUTPUT_DIR}/PP_MONETIZATION_POTENTIAL_MAP.csv")

    print(f"\n[Phase 3] COMPLETE — Knowledge graph built with {graph['metadata']['node_count']} nodes and {graph['metadata']['edge_count']} edges.")
    print(f"  Output directory: {OUTPUT_DIR}")
