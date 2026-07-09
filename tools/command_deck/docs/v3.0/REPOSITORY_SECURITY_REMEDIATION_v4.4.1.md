# SYS_OS v4.4.1 — REPOSITORY SECURITY REMEDIATION

**Type:** Security remediation + controlled cleanup. No push. No history rewrite.
No key rotation (operator action). No live infrastructure.
**Date:** 2026-06-28
**Trigger:** Critical finding from the v4.4.0 Live Infrastructure Activation Audit.

---

## 1. What was found

A real-looking secret was **committed and tracked** in the repository:

| Attribute | Value |
|---|---|
| Path | `CORE_SYSTEMS/gemini-app/.env` |
| Tracked by git | YES (before remediation) |
| Variable | `GOOGLE_API_KEY` |
| Value (redacted) | `AIza…` · length 39 · matches Google API-key pattern |
| Location | **OUTSIDE** the SYS_OS subtree (`tools/command_deck/`) |

Repo-wide tracked-file scan (redacted, counts only):
- Google `AIza…` keys: **1** — `CORE_SYSTEMS/gemini-app/.env` (this finding only).
- JWTs (`eyJ….…`): none. OpenAI `sk-…`: none.
- `service_role`: documentation mentions only in `ECC-Temp/` healthcare/PHI
  compliance docs — **not keys** (false positives).
- `ARCHIVE/Prime_Pathwy_BACKUP_APRIL28/package*.json`: npm manifests, no secrets
  (false positive on the word "backup").

## 2. Why it matters

- A committed API key is exposed to anyone with repository access **and remains in
  git history** even after removal. If the repo is or ever was public/shared, treat
  the key as **compromised**.
- GitHub Pages would publish only the chosen source path (the `tools/command_deck`
  subtree), so the **hosted site** would not serve this key — but the
  **repository** and its **history** would.

## 3. Scope separation (important)

| Scope | Status |
|---|---|
| **SYS_OS subtree** (`tools/command_deck/`) | ✅ **CLEAN** — no tracked `.env`, `config.local.js`, backup JSON, or service-role key. v4.3 added `tools/command_deck/.gitignore` excluding the real `config.local.js`. |
| **Whole repository** (non-SYS_OS) | 🔴 Was exposing `CORE_SYSTEMS/gemini-app/.env`. Remediated here (tracking + safeguards). Key rotation + history purge remain operator actions. |

This separation matters: **SYS_OS itself was never the source of the leak.** The
exposure is a sibling project (`gemini-app`) in the same repository.

## 4. What was remediated (this mission)

1. **Untracked** the secret without deleting the local working copy:
   `git rm --cached CORE_SYSTEMS/gemini-app/.env`
   - Local `.env` preserved on disk (the app may still need it).
   - Verified: now untracked **and** ignored (cannot be re-added).
2. **Added scoped ignore** `CORE_SYSTEMS/gemini-app/.gitignore`:
   ```
   .env
   .env.*
   !.env.example
   ```
   (Root `.gitignore` already had `.env`/`.env.*`; the scoped negation re-includes
   the example so it can be committed.)
3. **Added safe template** `CORE_SYSTEMS/gemini-app/.env.example` — placeholder
   only: `GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE`.
4. **This report.**

No SYS_OS source code was modified. No git history was rewritten. No key value was
printed or committed.

## 5. What still requires OPERATOR action (outside this mission)

1. **🔑 Rotate the Google API key NOW.** Removing it from tracking does **not**
   invalidate the exposed key. Regenerate it at
   https://aistudio.google.com/app/apikey (or Google Cloud Console) and update the
   local `.env` with the new value.
2. **Confirm repository visibility** (public vs private) on GitHub. `gh` was
   unavailable during the audit, so this is unconfirmed. If public → assume the old
   key is compromised (rotation is mandatory).
3. **Decide on git-history purge.** The old key remains in history. If the repo was
   ever public/shared, purge it with `git filter-repo` (or BFG) — a **separate,
   authorized** operation (history rewrite is disruptive and out of scope here).

## 6. Future rule (repository hygiene)

- **No `.env` files committed** — ever. Commit `.env.example` templates only.
- **No `config.local.js` committed** — it is git-ignored under
  `tools/command_deck/.gitignore`.
- **No backup JSON, no service-role keys, no private keys** in version control.
- New subprojects must ship a `.gitignore` + `.env.example` from day one.

## 7. SYS_OS regression (post-cleanup)

SYS_OS untouched by this cleanup (the change is a sibling subtree). Re-verified:
boots v4.3.0 · smoke 18/18 · drills 6/6 · maintenance 10/10 · integrity 88/0 ·
gate 36/0 · vault chain valid · monitoring active · no console errors.
