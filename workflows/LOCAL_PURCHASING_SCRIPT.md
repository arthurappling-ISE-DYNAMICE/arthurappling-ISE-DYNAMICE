# LOCAL PURCHASING INQUIRY — NEPQ CALL SCRIPT
**Author:** Arthur F. Appling Sr. — Lead Technical Architect
**Entity:** AA Capital INC dba Prime Pathwy · EIN 84-4788578
**NAICS:** 561720 (Janitorial) · 562111 (Hauling)
**Phone:** (707) 435-3998 · **Email:** contact@primepathwy.com
**Address:** 425 Virginia St STE B, Vallejo, CA 94590
**Classification:** Institutional Grade | Cold Outreach Doctrine

> **Rule:** You are not pitching. You are asking for instructions. Purchasing agents give instructions all day — make it easy for them to help you.

---

## PRE-CALL CHECKLIST
- [ ] Have EIN (84-4788578) ready if asked
- [ ] Have NAICS codes (561720 / 562111) ready if asked
- [ ] Have business address ready: 425 Virginia St STE B, Vallejo, CA 94590
- [ ] Know the SB cert status: "Currently in process with Cal eProcure"
- [ ] Call during mid-morning (9:30–11:00 AM) — purchasing staff are most available

---

## CALL SCRIPT — CITY OF VALLEJO

**Directory:** cityofvallejo.net → City Hall → Finance → Purchasing
**Direct line target:** Vallejo Finance / Purchasing Division

---

### OPENING (The Connection)
> *"Hi, I was hoping you could help me. My name is Arthur Appling — I'm a local business owner here in Vallejo. AA Capital Incorporated, doing business as Prime Pathwy.*
>
> *I was trying to find out who handles the informal vendor list for janitorial or hauling services — specifically for purchases under the $15,000 threshold."*

**Wait for them to respond.** If transferred, repeat the opening to the next person.

---

### THE PROBLEM AWARENESS QUESTION
> *"Is there a specific portal or process you prefer local vendors to use so we don't miss any of the emergency or micro-purchase requests that come through?"*

**Listen.** Write down exactly what they say. This is intelligence.

**If they mention a portal:** Ask for the URL.
**If they say "we don't have one":** Move to the commitment question.
**If they say "we use a formal bid process only":** Ask: *"Is there a threshold below which you can issue a PO directly without a formal bid?"*

---

### THE COMMITMENT CLOSE
> *"Once I have that link or process — would it be best to send my Small Business certification proof directly to you, or is there a general purchasing inbox for that?"*

**Get a name and email.** This becomes your direct line.

> *"And just so I have it right — what's the best email to send that to? And who should I address it to?"*

---

### CREDENTIALING (only if they ask who you are)
> *"We're a Vallejo-based janitorial and hauling company — NAICS 561720 and 562111. We're currently completing our California Small Business certification through Cal eProcure. EIN 84-4788578. We've been operating locally and are specifically looking to support city and county agencies."*

---

### CLOSE AND LOG
> *"Thank you — I really appreciate your help. I'll follow up with our credentials to that email. Have a great day."*

**Immediately after the call — log:**
- Contact name + title
- Email obtained
- Portal / process they described
- Next action required

---

## CALL SCRIPT — SOLANO COUNTY PURCHASING

**Portal:** solanocounty.com → Departments → Purchasing → Open Bids
**Phone:** Solano County Purchasing Division (look up current number on portal)

---

### OPENING
> *"Hi, I was hoping you could help me. My name is Arthur Appling — I'm a local business owner in Vallejo. AA Capital Incorporated, doing business as Prime Pathwy.*
>
> *We provide janitorial and hauling services — NAICS 561720 and 562111 — and I was hoping to find out how local vendors get added to the notification list for informal or micro-purchase bids in those categories."*

---

### PROBLEM AWARENESS
> *"Is there a portal you prefer vendors register on — or is it more of a direct outreach process when a need comes up?"*

---

### COMMITMENT
> *"Once we complete our California Small Business certification through Cal eProcure — is that something we'd submit directly to your office to be flagged as a local SB vendor? Or does that happen automatically through the state system?"*

---

### CREDENTIALING (if asked)
> *"We're based at 425 Virginia St STE B here in Vallejo. EIN 84-4788578. We do full property turnovers, eviction clean-outs, debris haul-away, and janitorial services. We're completing SB certification now through Cal eProcure."*

---

## CALL LOG TEMPLATE

| Field | Entry |
|-------|-------|
| Agency | City of Vallejo / Solano County |
| Date Called | ________________ |
| Contact Name | ________________ |
| Contact Title | ________________ |
| Phone | ________________ |
| Email Obtained | ________________ |
| Portal / Process | ________________ |
| SB Cert Required | Y / N |
| Threshold Confirmed | $________________ |
| Follow-Up Required | ________________ |
| Follow-Up Date | ________________ |
| Status | Cold / Warm / On Vendor List |

---

## TECHNICAL LAYER — Call Log Schema Definitions
> Automation-ready types mirroring the call log above. Human table is the source of truth; these types enforce it in code.

### TypeScript Interfaces

```typescript
type Agency = 'city_of_vallejo' | 'solano_county'

type CallStatus = 'cold' | 'warm' | 'on_vendor_list'

type SbCertRequired = 'yes' | 'no' | 'unknown'

interface CallLog {
  readonly id: string
  agency: Agency
  dateContacted: string         // ISO 8601: "YYYY-MM-DD"
  contactName: string
  contactTitle: string
  phone: string
  emailObtained: string
  portalProcess: string
  sbCertRequired: SbCertRequired
  thresholdConfirmed: number | null
  followUpRequired: boolean
  followUpDate: string | null   // ISO 8601: "YYYY-MM-DD"
  status: CallStatus
  notes?: string
}

type CreateCallLogDto = Omit<CallLog, 'id'>

interface CallLogRepository {
  findAll(filters?: { agency?: Agency; status?: CallStatus }): Promise<CallLog[]>
  findById(id: string): Promise<CallLog | null>
  create(data: CreateCallLogDto): Promise<CallLog>
  update(id: string, data: Partial<CallLog>): Promise<CallLog>
}
```

### Zod Validation Schema

```typescript
import { z } from 'zod'

const callLogSchema = z.object({
  agency: z.enum(['city_of_vallejo', 'solano_county']),
  dateContacted: z.string().date(),
  contactName: z.string().min(1),
  contactTitle: z.string().min(1),
  phone: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/),
  emailObtained: z.string().email(),
  portalProcess: z.string().min(1),
  sbCertRequired: z.enum(['yes', 'no', 'unknown']),
  thresholdConfirmed: z.number().positive().nullable(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().date().nullable(),
  status: z.enum(['cold', 'warm', 'on_vendor_list']),
  notes: z.string().optional(),
})

type CallLogInput = z.infer<typeof callLogSchema>
```

### Python Dataclasses

```python
from __future__ import annotations
from dataclasses import dataclass
from typing import Literal

Agency = Literal['city_of_vallejo', 'solano_county']
CallStatus = Literal['cold', 'warm', 'on_vendor_list']
SbCertRequired = Literal['yes', 'no', 'unknown']

@dataclass(frozen=True)
class CallLog:
    id: str
    agency: Agency
    date_contacted: str           # ISO 8601: "YYYY-MM-DD"
    contact_name: str
    contact_title: str
    phone: str
    email_obtained: str
    portal_process: str
    sb_cert_required: SbCertRequired
    threshold_confirmed: float | None
    follow_up_required: bool
    follow_up_date: str | None    # ISO 8601: "YYYY-MM-DD"
    status: CallStatus
    notes: str | None = None
```

---

## OBJECTION MAP

| They Say | You Say |
|----------|---------|
| "We only use formal bids" | *"Understood — is there a dollar threshold below which you can issue informally?"* |
| "We're not accepting new vendors right now" | *"No problem — when does that window typically open? And is there a way to get on a waitlist?"* |
| "Send us your info by email" | *"Absolutely — what's the best email, and who should I address it to?"* |
| "We use a state portal" | *"Is that Cal eProcure? We're already registering there — does our SB cert post automatically to your system?"* |
| "We don't have a vendor list" | *"If a micro-purchase need came up for janitorial or hauling, how would you typically find a vendor quickly?"* |

---

## LINKED RESOURCES
- Elite 10 Engine (Bid Sources): `workflows/ELITE_10_ENGINE.md`
- SB Cert Payload: `workflows/SB_CERT_PAYLOAD.md`
- Government Bid SOP: `workflows/government_bid_SOP.md`
- Master Execution Ledger: `workflows/MASTER_EXECUTION_LEDGER.csv`
