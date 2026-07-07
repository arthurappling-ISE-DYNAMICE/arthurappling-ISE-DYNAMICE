# 02_Architecture

## What Belongs Here
- High-level system architecture principles for SYS_OS and related tools.
- How the frontend, backend, auth, and persistence layers relate.
- Public/private boundaries and deployment topology at a conceptual level.

## What Does Not Belong Here
- Line-by-line code documentation (lives in the code itself).
- One-off engineering decisions with a date and rationale (→
  `03_Engineering_Decisions/`).
- Secrets, credentials, or connection strings — never.

## Example Entries
- `SYS_OS_ARCHITECTURE_PRINCIPLES.md`

## How Future AI Sessions Should Update It
Update when a structural architecture principle changes (e.g., a new layer
is introduced, a boundary is redrawn). Verify against `docs/CURRENT_STATE.md`
and actual repo structure before writing — Rule Zero applies here too.
