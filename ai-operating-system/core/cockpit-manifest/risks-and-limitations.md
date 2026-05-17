# COCKPIT MANIFEST — Risks & Limitations
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Known Limitations

- **Point-in-time snapshot — generated 2026-04-18** — any system change, file reorganization, or milestone completion after this date is not reflected. The manifest becomes more stale over time until a new version is generated.
- **Ground Truth Gaps may be resolved** — the manifest lists gaps as of 2026-04-18. Some gaps (2023 tax return, Stripe integration) may have been closed. Never treat listed gaps as current without filesystem verification.
- **Port numbers may have changed** — Port 3000 (Turnover System) and Port 3132 (Betting Console) are documented but not guaranteed current. Verify via Recursive Integrity Audit PASS 2 before assuming services are live.
- **Vault paths are as-of snapshot date** — vault file references (e.g., `vault/prime_pathwy_master/assets/`) are from 2026-04-18 state. Any vault reorganization since then makes paths potentially stale.
- **No automated refresh** — the manifest is generated manually. There is no automated process to keep it current. Stale manifests accumulate silently if new versions are not generated after major milestones.

---

## Failure Modes

| Scenario | What Breaks | Mitigation |
|----------|-------------|------------|
| Acting on stale manifest port | Service not found; session blocked | Always run PASS 2 health check before trusting port numbers |
| Acting on stale vault path | File not found; data retrieval fails | Run `ls` on vault path before reading — verify file exists at current location |
| Ground Truth Gap assumed open | Work blocked on a gap already closed | Verify gap against current filesystem before treating as an active blocker |
| Manifest used as system-map.md substitute | Miss all new Wave 1–4 imports | system-map.md is the master index; COCKPIT_MANIFEST is the founding snapshot |

---

## Deprecation Risk

**Medium-High over time.** As the ecosystem evolves, the 2026-04-18 snapshot becomes increasingly distant from live state. A new manifest should be generated after: (1) any revenue engine activation, (2) vault major reorganization, (3) completion of the $125K SBDC loan, or (4) any 1.5-Year Automation Goal pillar fully closed.

---

## Conflicts With

The COCKPIT MANIFEST documents pre-AI Operating System ecosystem structure. It may describe file paths and system locations that have since been superseded by the AI OS reorganization (ai-operating-system/ subfolder structure). In any conflict between the manifest's described structure and the current ai-operating-system/ structure: the current filesystem governs, and the AI OS system-map.md is the authoritative navigation reference.
