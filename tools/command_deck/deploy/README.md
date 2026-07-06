# SYS_OS — Public Deploy (v4.6 HOSTING_STRATEGY_FIX)

`deploy/public/` is the **only** thing that may ever be publicly hosted — a
curated, allowlist-built artifact. The repo root and `tools/command_deck/`
itself are **never** publish sources.

## Build → Validate → (later) Deploy

```bash
cd tools/command_deck
node scripts/build_public_deploy.js       # builds deploy/public/ from the allowlist
node scripts/validate_public_deploy.js    # MUST print VALIDATION PASS
```

- With a local `assets/js/config.local.js` present, the build extracts **only**
  `SUPABASE_URL` + the anon/publishable key into `config.public.js` (browser-safe
  by design; RLS machine-verified per v4.5.4). `TEST_USERS`, passwords, and every
  other field are never carried over; `sb_secret_`/`service_role` **abort the build**.
- Without local config, a LOCAL-only artifact is built (boots, no remote).

## What can never end up in the artifact
Archives, docs, audit/release reports, `index_v*` snapshots, `pilot_backend/`,
helper scripts (`.bat`/`.ps1`/`.py`), `config.local.js`, `.env*`, backup JSON,
test credentials, markdown of any kind — enforced twice: the builder can only
copy named allowlist files, and the validator fails on any extra name or
forbidden content.

## Deploy-time (NOT yet — GitHub Pages is NOT_DEPLOYED)
`deploy/public/` is gitignored during preparation. Actually deploying is a
deliberate, checklist-gated act — see
`docs/v3.0/PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md`, including the
**business-content signoff** (the dashboard displays operator identity and
business metrics; publishing them is an explicit owner decision).

## Rollback
Delete `deploy/public/` and rebuild any time (fully generated). If ever
deployed: disable Pages or revert the deploy commit → site gone; local app and
data untouched.
