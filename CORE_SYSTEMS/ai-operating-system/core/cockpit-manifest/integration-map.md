# COCKPIT MANIFEST — Integration Map
**Owner:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy

---

## Upstream Dependencies

| Source | What It Provides |
|--------|-----------------|
| Full GeminiEcosystem filesystem (2026-04-18 state) | All system paths, port numbers, vault structure documented |
| `core/system-principles.md` | Hardcoded constants referenced throughout manifest (EIN, DSCR, DUNS) |
| Recursive Integrity Audit | Current live state validation — must run before acting on manifest data |

---

## Downstream Consumers

| Consumer | What It Receives |
|----------|-----------------|
| All agents and sessions | Ecosystem orientation — where systems live, what is live vs. staged |
| `ai-operating-system/system-map.md` | Founding architecture reference — system-map.md supersedes for current navigation |
| Architect (Arthur F. Appling Sr.) | 1.5-Year Automation Goal status board — milestone tracking anchor |
| Future manifest versions | Previous state reference — diff against to identify what changed |

---

## Workflow Position

```
Session start (context loading) OR new agent orientation
        ↓
COCKPIT MANIFEST — load for ecosystem overview (founding state)
        ↓
system-map.md — cross-reference for current AI OS structure
        ↓
Recursive Integrity Audit — verify current live state before acting
        ↓
Operational work begins with full context
```

---

## Active Integrations

| System | Integration Type | Status |
|--------|-----------------|--------|
| `ai-operating-system/system-map.md` | Superseded by for current navigation | Active — system-map.md governs |
| `workflows/research/recursive-integrity-audit/` | Live state validator — required before manifest data is acted on | Active |
| `core/system-principles.md` | Constants cross-reference | Active |

---

## Technical Key Trigger

No slash command. Loaded manually as context document for session orientation.

**Load sequence:**
```
1. Load: core/cockpit-manifest/source.md (ecosystem overview)
2. Load: ai-operating-system/system-map.md (current AI OS structure)
3. Run: Recursive Integrity Audit (live state confirmation)
4. Begin session with full context active
```

---

## Redundancy Flags

**Partial overlap with system-map.md.** The COCKPIT MANIFEST provides founding architecture context; system-map.md provides current AI OS navigation. They are complementary — COCKPIT MANIFEST is the origin document, system-map.md is the current operational index. In any conflict: system-map.md governs.
