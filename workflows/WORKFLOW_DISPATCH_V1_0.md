# WORKFLOW: DISPATCH ROUTING & SLA COMPLIANCE
## WAT Operational SOP | Version 1.0.0 | Authority: Arthur F. Appling Sr.

---

## 1. PURPOSE & SCOPE
This Standard Operating Procedure (SOP) defines the mandatory execution steps for dispatching field service technicians to high-ticket commercial facilities and logistics clients. Maintaining an optimal dispatch lifecycle directly protects service margins and ensures strict SLA compliance.

---

## 2. OPERATIONAL WORKFLOW SEQUENCE

```
  [ TICKET INGESTION ] ──► [ AI DISPATCH MATCHING ] ──► [ TECHNICIAN DISPATCH ]
                                    │                            │
                                    ▼                            ▼
                             (Verify SLA Priority,        (Send Geofenced SMS,
                              Match Skill Tier)            Monitor ETA)
                                    │                            │
                                    ▼                            ▼
  [ WORK COMPLETED ] ◄─── [ PHOTO VERIFICATION ] ◄───── [ MOBILE CHECK-IN ]
```

---

## 3. DETAILED EXECUTION STEPS

### Step 1: Ticket Ingestion & Priority Triage
Upon receiving a client service request via the API, the system automatically parses the metadata and assigns a severity level.
- **Action:** Verify the ticket is logged in the `work_orders` table with a valid `client_id` and `priority` rating.
- **SLA Trigger:** Critical tickets (SEV-1) must have an assigned technician within 15 minutes of ingestion.

### Step 2: AI-Powered Dispatch Matching
The cognitive dispatch agent matches the ticket requirements against active technician profiles.
- **Matching Criteria:** Location proximity (GPS coordinates), technician skill tier (Tier 1-3), and current active workload.
- **Action:** Update the `assigned_to` field in the `work_orders` table with the selected technician's identifier.

### Step 3: Mobile Check-In & Route Monitoring
Once assigned, the technician receives an automated notification via the mobile portal.
- **Action:** Technician must tap "Accept" within 10 minutes. The system automatically calculates the optimal route using real-time traffic data and sends a geofenced SMS to the client with the technician's ETA.
- **Check-In:** Upon arrival, the technician must check in via the mobile portal, which verifies their location against the client's geofenced coordinates.

### Step 4: Work Execution & Proof of Performance
Technician performs the required maintenance or repair according to the specific service SOP.
- **Action:** Before closing the ticket, the technician must capture at least two high-resolution photos of the completed work and attach them to the ticket.
- **Verification:** The system runs an automated image verification check to ensure the photos are not duplicates and contain valid metadata.

### Step 5: Ticket Closure & Billing Ingestion
Upon successful photo verification, the ticket is marked as resolved.
- **Action:** Update `status` to 'Resolved' and log `resolved_at` and `resolution_notes` in the database.
- **Billing Trigger:** The billing system automatically generates an invoice draft in the `invoices` table based on the contract's pricing tier.

---

## 4. AUDIT & QUALITY CONTROL
Operations managers must audit a random sample of 10% of resolved work orders weekly to ensure:
- [ ] First-Time Fix Rate (FTFR) remains above **85%**.
- [ ] Mean Time to Resolution (MTTR) is below **4 hours** for high-priority tickets.
- [ ] Photo proof of performance is present and valid on all closed tickets.

---

*Prime Pathwy Operational Workflow — Confidential — Not for Public Distribution*
