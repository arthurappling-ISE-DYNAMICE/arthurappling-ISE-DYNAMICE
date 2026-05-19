# Turnover Inspection Checklist — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **Manual execution only** — the checklist is a paper/digital form completed by field personnel. It has no automated enforcement mechanism. Compliance depends on crew discipline and supervisor oversight.
- **Photo upload is manual** — photos must be manually uploaded to vault after each job. No automatic sync unless cloud storage app is configured on the crew's device.
- **Scope variations require judgment** — the 10 points are calibrated for full turnover. Clean-out only, haul-away only, and paint-only engagements require the operator to identify which points are N/A.
- **No timestamp enforcement** — the checklist cannot verify that photos were taken before work began vs. staged after the fact. Field honesty and supervisor verification are the only controls.
- **Vault folder must be pre-created** — if the client vault folder does not exist before the job starts, photos have nowhere to go. This is an operational setup dependency.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Before photos skipped | No documentation of pre-existing damage; liability exposure if client disputes | Point 1 is non-negotiable — pause work until documented |
| Disposal receipt lost | Haul-away expense not billable | Photograph receipt immediately after dump run; upload same day |
| Point 10 sign-off verbal only | No written evidence of client acceptance | Require email confirmation minimum; follow up within 24 hours if signed form not obtained at walkthrough |
| After photos at different angles than before | Dispute documentation is incomplete | Train crew to match before photo angles exactly for every room |
| Checklist not saved to vault | No audit trail for closed job | Completed checklist scanned/photographed and uploaded to `vault/[CLIENT]/reports/` same day as close |

---

## Deprecation Risk

**Low.** The 10-Point standard is based on field operations logic, not software or platform dependency. It will remain valid as long as Prime Pathwy operates property turnover services. Only change driver would be scope expansion (e.g., adding electrical or plumbing inspection points).

---

## Conflicts With

None. This workflow is isolated to the real-estate vertical and does not overlap with any other current workflow or agent.
