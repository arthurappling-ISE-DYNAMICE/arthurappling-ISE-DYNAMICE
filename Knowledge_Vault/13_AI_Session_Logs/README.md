# 13_AI_Session_Logs

## Purpose
This folder preserves a record of what happened in significant AI-assisted
work sessions — the mission, the decisions, the problems hit, and the
outcome — so that context does not evaporate when a chat session ends.

## What Belongs Here
- One log per major mission (deployment, verification, architecture build,
  audit, etc.).
- Dates, mission type, files touched, decisions made, problems encountered,
  fixes applied, verification results, and lessons learned.
- Pointers to relevant commits, decision logs, or lessons-learned entries
  elsewhere in the vault.

## What Does Not Belong Here
- Full raw chat transcripts — summarize, don't paste.
- Anything that duplicates a dedicated Engineering Decision or Lesson
  Learned entry wholesale — link to it instead of repeating it.
- Client-identifying or business-sensitive detail beyond what's needed to
  understand the engineering session.

## Rules
- **No passwords, keys, tokens, private credentials, or sensitive personal
  data** in any session log — ever, no exceptions.
- **Log engineering lessons, decisions, blockers, outcomes, and next
  steps** — the goal is that a future AI session (or Arthur) can read one
  file and understand what happened and what's next.
- **Every major mission should get one session log**, named
  `YYYY-MM-DD_short_description.md`, using `AI_SESSION_LOG_TEMPLATE.md`.
