# Turnover Inspection Checklist — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

Before activating this checklist on any job, confirm the following are true.
Unconfirmed state = do not start work. Request Ground Truth Audit.

- [ ] Job Header is complete — property address, unit, job type, subcontractor name, crew lead, date
- [ ] Vault folder exists for this client: `vault/[CLIENT]/photos/before/`, `vault/[CLIENT]/photos/after/`, `vault/[CLIENT]/receipts/`, `vault/[CLIENT]/reports/`
- [ ] Camera / smartphone ready with timestamping enabled
- [ ] Scope of work is defined in writing before crew arrives — no verbal-only scope
- [ ] Arthur F. Appling Sr. (or designated Prime Pathwy supervisor) is available for Point 10 walkthrough

---

## Activation

This is a field operations checklist — no software installation required.

### Step 1 — Print or Load Digital Checklist

**Command (digital):**
```
Open: ai-operating-system/workflows/real-estate/turnover-checklist/source.md
Print or load on mobile device.
Complete Job Header block before crew begins any work.
```

**Pass Criteria:** Job Header filled — all fields completed with actual values, not blanks.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Job Header blank | Checklist pulled after work started | Pause work. Complete header retroactively with crew lead confirmation of start time. |
| Vault folder missing | Client folder not created | Create folder structure before uploading any photos. |

---

### Step 2 — Photo Documentation (Points 1 and 9)

**Command:**
```
Before touching anything:
  Photograph every room (wide angle), all damage/debris (close-up), and exterior entry.
  Upload immediately to: vault/[CLIENT]/photos/before/
  Confirm minimum 8 photos before any work begins.
```

**Pass Criteria:** Minimum 8 timestamped before photos uploaded to vault. Every room in scope covered.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Fewer than 8 photos | Area skipped | Pause work on that area until photographed |
| Photos not timestamped | Camera settings incorrect | Enable date/time overlay in camera settings before next job |
| Upload failed | No connectivity | Save locally and upload at first available connection — do not close job without upload |

---

### Step 3 — Execute Points 2–8 in Sequence

**Command:**
```
Work through Points 2–8 in order.
Check each box only when the standard is physically met — not when work is underway.
Any FAIL stops that point's work until corrected.
```

**Pass Criteria:** All boxes checked for each point in scope. No FAIL items left open.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Point left unchecked at close | Work incomplete | Add to punch list. Do not proceed to Point 10. |
| Disposal receipt missing | Dump run not documented | Retrieve receipt or obtain dump facility confirmation before job close. |

---

### Step 4 — Final Walkthrough + Sign-Off (Point 10)

**Command:**
```
Prime Pathwy supervisor walks unit with crew lead.
All punch list items resolved.
Client walkthrough completed.
Obtain written sign-off: email confirmation or signed form.
Save signed form to: vault/[CLIENT]/reports/
```

**Pass Criteria:** Written sign-off on file. All 10 points PASS. OVERALL VERDICT marked PASS — JOB CLOSED.

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| Client unavailable for walkthrough | Scheduling conflict | Obtain email sign-off — "I confirm the unit at [ADDRESS] meets the agreed scope." Do not close without written confirmation. |
| Punch list items unresolved | Work incomplete | Do not mark PASS. Schedule return visit. Job remains open. |
