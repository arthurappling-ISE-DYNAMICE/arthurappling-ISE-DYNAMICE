# 15_AI_Workflows

## Purpose
Document repeatable, end-to-end AI-assisted workflows — multi-step
sequences that combine prompts, tools, and human approval gates into a
reliable process.

## What Belongs Here
- A workflow library index (`WORKFLOW_LIBRARY_INDEX.md`).
- Individual workflow entries built from `WORKFLOW_TEMPLATE.md`, including
  triggers, steps, approval gates, verification checks, and rollback plans.

## What Does Not Belong Here
- Single reusable prompts (→ `14_AI_Prompts/`).
- One-time engineering decisions (→ `03_Engineering_Decisions/`).
- Client-specific delivery steps (→ `16_Client_Delivery_System/`).

## How Future AI Sessions Should Update It
- Add a workflow only once it has been run successfully at least once —
  document what actually happened, not an idealized version.
- Keep human approval gates explicit; never document a workflow that skips
  necessary confirmation steps (e.g., before push, before hosting).
- Update the index whenever a new workflow is added or an existing one is
  materially changed.

## Warning
**Never store secrets.** No API keys, passwords, tokens, or credentials in
any workflow step or example output.
