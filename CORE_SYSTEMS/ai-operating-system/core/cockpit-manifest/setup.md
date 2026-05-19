# COCKPIT MANIFEST — Setup
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

### [GROUND TRUTH GATE]

The COCKPIT MANIFEST is a point-in-time snapshot (2026-04-18). Before using it as a reference:

- [ ] Verify: current date is after 2026-04-18 — the manifest reflects state at that date, not today
- [ ] Verify: any specific system referenced (ports, file paths, vault contents) against current live state via Recursive Integrity Audit before acting on manifest data
- [ ] Ground Truth Gaps section at manifest bottom documents known stale state — resolve via current filesystem check, not manifest assumption

---

## How to Use This Document

The COCKPIT MANIFEST is a read-only reference — it is never updated in place. When the ecosystem changes significantly, a new manifest is generated and placed alongside the previous one with a new date stamp.

**Reading the manifest:**
```
1. Load: core/cockpit-manifest/source.md
2. Locate the relevant section (ACTIVE OPERATIONS, VAULT, DEVELOPMENT LAB, etc.)
3. Cross-reference with live filesystem before acting on any path or port reference
4. Note Ground Truth Gaps — verify whether gaps listed have been closed before assuming they still exist
```

**Pass Criteria:** Any action derived from the manifest confirmed against current live state. Do not act on manifest data alone.

**Error Map:**

| Error | Cause | Resolution |
|-------|-------|------------|
| Port 3000 or 3132 not responding | Service down, not manifest error | Restart per service-specific setup.md |
| File path from manifest not found | Ecosystem reorganized since 2026-04-18 | Use Recursive Integrity Audit to locate current path |
| Ground Truth Gap listed but now resolved | Manifest is stale on that item | Verify with filesystem; record resolution in memory/lessons-learned.md |

---

## Generating a New Manifest

When a major operational phase is complete (milestone closed, new system activated, structural reorganization done):

```
1. Run Recursive Integrity Audit — confirm full system state
2. Generate new COCKPIT_MANIFEST with current date: docs/COCKPIT_MANIFEST_YYYY-MM-DD.md
3. Copy to core/cockpit-manifest/source.md (update in place — prior version in git history)
4. Update Ground Truth Gaps section to reflect current open items only
```
