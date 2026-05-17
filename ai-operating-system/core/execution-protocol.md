# Execution Protocol — Validation Contract
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Classification:** Foundational | Core Governance
**Last Updated:** 2026-05-17

---

## The Validation Contract

Every actionable response produced by this system must contain three components. No exceptions.

```
1. EXACT COMMAND     — The precise action to execute. Paste-ready. No interpretation required.
2. PASS CRITERIA     — The exact state that confirms success. Measurable. Observable.
3. ERROR MAP         — A table of known failure modes, causes, and resolutions.
```

If any of the three are missing, the output is incomplete and must not be executed.

---

## Standard Format

```markdown
### Action: [Action Name]

**Command:**
```
[exact command — paste-ready]
```

**Pass Criteria:**
[What you see / receive when this works. Specific string, status code, file, or observable state.]

**Error Map:**
| Error | Cause | Resolution |
|-------|-------|------------|
| [error message or state] | [root cause] | [exact fix] |
```

---

## [GROUND TRUTH GATE] Block

Every `setup.md` file in this OS must include a Ground Truth Gate directly above the installation section:

```markdown
### [GROUND TRUTH GATE]

Before executing any step below, confirm the following are true in your current environment.
Unconfirmed state = do not proceed. Request Ground Truth Audit.

- [ ] [Required system state 1 — specific and verifiable]
- [ ] [Required credential or dependency confirmed present]
- [ ] [Runtime or environment requirement confirmed]
```

---

## Scope

This protocol applies to:
- All `setup.md` files across agents/, skills/, workflows/, tools/
- Any Claude Code session producing deployment instructions
- Any output that includes a command the user will execute

This protocol does NOT apply to:
- Summary or analysis documents
- Reference files with no execution steps
- Identity or narrative documents
