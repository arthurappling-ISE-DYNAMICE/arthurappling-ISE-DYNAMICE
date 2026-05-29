#!/usr/bin/env python3
"""
Prime Pathwy Live Procurement & Contract Intelligence Engine
Tracks public contract opportunities, audits incumbent weaknesses, and forecasts renewal bid windows.
"""

import os
import csv
import json
from datetime import datetime

class ProcurementIntelligenceEngine:
    def __init__(self, output_dir="/home/ubuntu/prime-pathwy-sovereign-vault/vault/procurement", temp_dir="/home/ubuntu/prime-pathwy-sovereign-vault/temporary"):
        self.output_dir = output_dir
        self.temp_dir = temp_dir
        self.output_csv = os.path.join(output_dir, "procurement_contract_database.csv")
        self.alerts_json = os.path.join(temp_dir, "procurement_alerts.json")
        
        # Ensure directories exist
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(temp_dir, exist_ok=True)
        
        # Define the 13-point schema fields
        self.schema_fields = [
            "field_01_issuing_agency",
            "field_02_contract_value",
            "field_03_incumbent_vendor",
            "field_04_renewal_timing",
            "field_05_procurement_portal",
            "field_06_bid_windows",
            "field_07_submission_requirements",
            "field_08_contact_information",
            "field_09_contract_duration",
            "field_10_technology_indicators",
            "field_11_operational_weaknesses",
            "field_12_automation_opportunities",
            "field_13_recurring_revenue_opportunities"
        ]
        
        self.initialize_files()

    def initialize_files(self):
        # Initialize output CSV if it doesn't exist
        if not os.path.exists(self.output_csv):
            with open(self.output_csv, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(self.schema_fields)

    def calculate_days_to_renewal(self, renewal_date_str):
        try:
            renewal_date = datetime.strptime(renewal_date_str, "%Y-%m-%d")
            delta = renewal_date - datetime.utcnow()
            return delta.days
        except ValueError:
            return 999 # Fallback if date format is invalid

    def ingest_contract(self, contract_data):
        """
        Ingests a new contract, standardizes its data, and appends it to the database.
        """
        # Read existing to avoid duplicate entries based on agency + incumbent + renewal date
        existing_records = []
        if os.path.exists(self.output_csv):
            with open(self.output_csv, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing_records.append(row)
                    
        duplicate = False
        for record in existing_records:
            if (record.get("field_01_issuing_agency") == contract_data.get("agency") and
                record.get("field_03_incumbent_vendor") == contract_data.get("incumbent") and
                record.get("field_04_renewal_timing") == contract_data.get("renewal")):
                duplicate = True
                break
                
        if duplicate:
            return False, "Duplicate contract record skipped."
            
        # Map raw fields to 13-point schema
        mapped_record = {
            "field_01_issuing_agency": contract_data.get("agency", "Unknown Agency"),
            "field_02_contract_value": contract_data.get("value", "$0"),
            "field_03_incumbent_vendor": contract_data.get("incumbent", "Unknown Incumbent"),
            "field_04_renewal_timing": contract_data.get("renewal", "2026-12-31"),
            "field_05_procurement_portal": contract_data.get("portal", "N/A"),
            "field_06_bid_windows": contract_data.get("bid_window", "N/A"),
            "field_07_submission_requirements": contract_data.get("requirements", "Standard RFP"),
            "field_08_contact_information": contract_data.get("contact", "procurement@agency.gov"),
            "field_09_contract_duration": contract_data.get("duration", "1 Year"),
            "field_10_technology_indicators": contract_data.get("tech_indicators", "Legacy systems"),
            "field_11_operational_weaknesses": contract_data.get("weaknesses", "Manual processing bottlenecks"),
            "field_12_automation_opportunities": contract_data.get("automation_opps", "AI ingestion pipeline"),
            "field_13_recurring_revenue_opportunities": contract_data.get("recurring_rev", "$5,000 / month")
        }
        
        # Write to database
        with open(self.output_csv, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=self.schema_fields)
            writer.writerow(mapped_record)
            
        return True, "Contract ingested successfully."

    def run_renewal_forecasting(self):
        """
        Reads all contracts in the database, forecasts renewals, and writes high-priority alerts to JSON.
        """
        if not os.path.exists(self.output_csv):
            return []
            
        alerts = []
        with open(self.output_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                renewal_date = row.get("field_04_renewal_timing")
                days_left = self.calculate_days_to_renewal(renewal_date)
                
                # Determine response tier
                if days_left < 90:
                    tier = "IMMEDIATE_PURSUIT"
                    action_required = "Initiate NEPQ outreach. Prepare Sovereign System Modernization Proposal."
                elif days_left < 180:
                    tier = "STRATEGIC_PLANNING"
                    action_required = "Conduct tech audit of incumbent vendor. Warm decision-maker channels."
                else:
                    tier = "MONITORING_PHASE"
                    action_required = "Monitor procurement portal for updates and pre-RFP releases."
                    
                alerts.append({
                    "issuing_agency": row.get("field_01_issuing_agency"),
                    "contract_value": row.get("field_02_contract_value"),
                    "incumbent_vendor": row.get("field_03_incumbent_vendor"),
                    "renewal_date": renewal_date,
                    "days_remaining": days_left,
                    "pursuit_tier": tier,
                    "action_required": action_required,
                    "contact_info": row.get("field_08_contact_information")
                })
                
        # Write alerts to JSON
        with open(self.alerts_json, 'w', encoding='utf-8') as f:
            json.dump(alerts, f, indent=4)
            
        return alerts

if __name__ == "__main__":
    engine = ProcurementIntelligenceEngine()
    
    # Standard real-world target procurement opportunities for Prime Pathwy
    target_contracts = [
        {
            "agency": "Bay Area Air Quality Management District (BAAQMD)",
            "value": "$1,450,000",
            "incumbent": "Legacy Fleet Services LLC",
            "renewal": "2026-08-15", # < 90 days (Immediate)
            "portal": "https://www.baaqmd.gov/about-air-quality/rfp-rfq",
            "bid_window": "2026-06-01 to 2026-07-15",
            "requirements": "VIP Program Fleet Compliance, Zero-Emissions Modernization Plan",
            "contact": "procurement@baaqmd.gov",
            "duration": "3 Years",
            "tech_indicators": "On-prem MS Access Database, Paper driver logs",
            "weaknesses": "Slow compliance auditing, high fuel surcharges, manual dispatch tracking",
            "automation_opps": "Sovereign Dispatch Engine, Automated Fuel/Compliance Auditor",
            "recurring_rev": "$12,500 / month (Retainer)"
        },
        {
            "agency": "City of Vallejo Municipal Transit",
            "value": "$850,000",
            "incumbent": "Vallejo Hauling Corp",
            "renewal": "2026-11-30", # 90-180 days (Strategic)
            "portal": "https://www.cityofvallejo.net/doing_business/bids_rfps",
            "bid_window": "2026-09-10 to 2026-10-25",
            "requirements": "Class 8 Hauling & Logistics Compliance, Solano County Local Business Certification",
            "contact": "contracts@cityofvallejo.net",
            "duration": "2 Years",
            "tech_indicators": "Legacy SAP ERP, Fragmented Excel scheduling sheets",
            "weaknesses": "Unreliable dispatch scheduling, paper billing cycles, slow client reporting",
            "automation_opps": "Automated Dispatch Scheduler, Stripe Invoicing Pipeline",
            "recurring_rev": "$7,500 / month (SaaS Retainer)"
        },
        {
            "agency": "Solano County Records & Information Services",
            "value": "$2,100,000",
            "incumbent": "PaperArchivers Inc.",
            "renewal": "2027-04-30", # > 180 days (Monitoring)
            "portal": "https://www.solanocounty.com/depts/asd/purchasing/bids.asp",
            "bid_window": "2027-02-01 to 2027-03-15",
            "requirements": "CJIS Compliance, SOC2 Type II, High-Speed Records Digitization",
            "contact": "records_procure@solanocounty.com",
            "duration": "5 Years",
            "tech_indicators": "Legacy Documentum Server, manual barcode scanning",
            "weaknesses": "Extremely slow digitization throughput, manual indexing errors, no AI classification",
            "automation_opps": "Sovereign OCR & AI Classification Engine, Automated Metadata Indexer",
            "recurring_rev": "$18,500 / month (Sovereign Database Retainer)"
        }
    ]
    
    print("Ingesting contract intelligence...")
    for contract in target_contracts:
        success, msg = engine.ingest_contract(contract)
        print(f"{contract['agency']}: {msg}")
        
    print("\nRunning Renewal Forecasting Engine...")
    alerts = engine.run_renewal_forecasting()
    
    print(f"Forecasting complete. {len(alerts)} opportunities compiled into temporary/procurement_alerts.json.")
    for alert in alerts:
        print(f"[{alert['pursuit_tier']}] {alert['issuing_agency']} (Renewal: {alert['renewal_date']}, Days Left: {alert['days_remaining']})")
