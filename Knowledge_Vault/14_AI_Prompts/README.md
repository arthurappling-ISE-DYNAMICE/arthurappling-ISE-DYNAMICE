# 14_AI_Prompts

## Purpose
Preserve reusable, tested prompts that reliably produce good results for
recurring Prime Pathwy work — so effective prompts survive past the chat
session that discovered them.

## What Belongs Here
- A versioned prompt library index (`PROMPT_LIBRARY_INDEX.md`).
- Individual prompt entries built from `PROMPT_TEMPLATE.md`, each with a
  tested version, expected output, and failure modes.

## What Does Not Belong Here
- One-off prompts that haven't been tested or refined.
- Full workflows spanning multiple steps/tools (→ `15_AI_Workflows/`).
- Client-specific data or business metrics embedded in a prompt example.

## How Future AI Sessions Should Update It
- Add a prompt only after it has actually been used and produced a
  reliable result — untested prompts stay in the working session, not the
  vault.
- Version prompts when they're revised; note what changed and why.
- Update `PROMPT_LIBRARY_INDEX.md` whenever a new category or entry is
  added.

## Warning
**Never store secrets.** No API keys, passwords, tokens, or credentials in
any prompt example — use placeholders instead.
