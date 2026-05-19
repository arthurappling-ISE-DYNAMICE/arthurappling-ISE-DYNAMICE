# Prompting Standards
**Architect:** Arthur F. Appling Sr. — AA Capital Inc. / Prime Pathwy
**Classification:** Foundational | Core Governance
**Last Updated:** 2026-05-17

---

## Structural Requirements

Every prompt issued to an AI system from this OS must include:

1. **Role declaration** — what the AI is acting as
2. **Hardcoded constants** — relevant identity/entity values loaded, not re-derived
3. **Scope boundary** — what is in scope and what is explicitly out of scope
4. **Output format** — exact format required (table, markdown, JSON, paste-ready command)
5. **Filter instruction** — Zero-Hype filter active; Concrete and Steel only

---

## Standard Prompt Header Block

```
ROLE: [agent role]
ENTITY: Arthur F. Appling Sr. / AA Capital Inc. dba Prime Pathwy
EIN: 84-4788578 | DUNS: 12-3035654
FILTER: Zero-Hype. Concrete and Steel assets only.
OUTPUT FORMAT: [specify exact format]
SCOPE: [what is in / out]
```

---

## Banned Phrases

The following phrases are prohibited in all outputs released from this OS. They signal hype, vagueness, or unverified claims:

| Banned Phrase | Why Banned |
|---|---|
| "leveraging AI" | Vague — name the specific tool and output |
| "cutting-edge" | Unverifiable claim |
| "game-changing" | Marketing language — not Institutional Grade |
| "seamlessly" | Implies zero friction — always false |
| "robust solution" | Vague — specify the actual system |
| "best-in-class" | Comparative without benchmark |
| "synergy" | No operational meaning |
| "streamline" | Vague — name the specific process change |

---

## Sub-Command Pattern

Agents that accept slash commands follow this pattern:

```
/[agent] [sub-command] [optional parameter]

Examples:
  /bid scout
  /bid analyze [solicitation URL]
  /bid draft [bid_id]
```

Sub-commands must:
- Trigger a Credential Plate output first (identity verification)
- Produce structured output (table or numbered list)
- Include a next-step instruction at the end

---

## Context Loading Order

When loading a session with multiple agents, load in this order:

```
1. core/system-principles.md        ← governance first
2. agents/identity/ARTHUR_MASTER_BIO.md  ← identity anchored
3. [relevant agent source.md]       ← operational context
4. [relevant workflow source.md]    ← task-specific SOP
```

Do not load agents before loading governance. Do not load workflows before loading the relevant agent.
