# SYS_OS v4.6.0 — HOSTING_STRATEGY_FIX

Resolves the two blockers that made GitHub Pages a NO-GO since the Fable 5
senior review: **F2** (Pages ↔ git-ignored config contradiction) and **F3**
(publish-scope exposure). Ships the safe hosting architecture — **without
deploying anything**. GitHub Pages remains NOT_DEPLOYED; Production remains
BLOCKED.

---

## F2 — the contradiction, and the chosen strategy (Option A, two-stage)

GitHub Pages serves only committed files, but SYS_OS's runtime config lives in
git-ignored `config.local.js`. As documented, a *configured* app could never be
hosted. **Resolution:**

1. **Build stage (shipped, v4.6):** `scripts/build_public_deploy.js` generates
   `deploy/public/assets/js/config.public.js` from the local config, extracting
   ONLY the Supabase URL + anon/publishable key + safe mode flags. `TEST_USERS`
   and all other fields are never carried; a `sb_secret_`/`service_role` key
   **aborts the build**. `deploy/public/` is **gitignored today** — v4.6 adds
   zero new exposure.
2. **Deploy stage (future, checklist-gated):** the operator deliberately removes
   the one ignore line and commits the validated artifact. Committing the anon
   key at that moment is safe **by design**: it is Supabase's browser key,
   protected by database-side RLS that is machine-verified (v4.5.4 status path,
   integrity-gated, 30-day freshness).

Why not the alternatives: **B** (Pages build-env injection) — Pages for this
repo is plain static hosting; no secret-env build exists to lean on. **C**
(manual post-deploy upload) — Pages has no post-deploy writable storage.
**D** (stay local) — abandons the mission. A-two-stage keeps preparation
zero-risk and makes eventual exposure a single conscious act.

## F3 — publish-scope: allowlist or nothing

The publish source is **never** the repo root or `tools/command_deck/` — only
the curated `deploy/public/` artifact. Enforced twice:

- **Builder** copies only *named* files: `index.html` (transformed), the 38
  runtime js modules, 2 css, 7 fonts, `supabase.js` (public SDK copy),
  `config.public.js`, `.deploy-manifest.json`. Directories are never copied
  wholesale — archives (24 old app versions with pre-hardening CSPs), 26
  `index_v*` snapshots, 85 internal docs/audit/release reports,
  `pilot_backend/`, helper scripts, and local files are structurally
  impossible to include.
- **Validator** (`scripts/validate_public_deploy.js`) fails the artifact on ANY
  file outside the allowlist, forbidden names (`config.local`, `.env`,
  `archives/`, `docs/`, `AUDIT_REPORT`, `.bat/.ps1/.py/.md`, `index_v*`,
  backup JSON, `pilot_backend`, `package*.json`), or forbidden content
  (`sb_secret_`, `service_role` assignments, inline TEST_USERS credential
  blocks, test-user emails, known burned passwords, and **any API key outside
  `config.public.js`**). Proven live: a planted `config.local.js` trips four
  independent rules.

### F3 residual — DECISION_REQUIRED (operator-owned, not engineering)
The dashboard **content itself** displays operator identity and business
figures (name/role, DSCR 7.42×, $130,000 allocation, pipeline) hardcoded in
`index.html`/`config.js`, plus business-flavored seed records. The artifact
ships them faithfully. **Publishing makes them public.** This is an explicit
signoff item in the operator checklist — deployment must not proceed until the
owner accepts (or a future build de-identifies the public variant).

## Public/private boundary (summary)

| Boundary | Contents |
|---|---|
| **Public (artifact only)** | index.html, 38 runtime modules, css, fonts, SDK copy, `config.public.js` (URL + anon key only), manifest |
| **Private (never built in)** | archives, snapshots, all docs/reports, pilot_backend, helper scripts, `config.local.js`, TEST_USERS/passwords, `.env`, backup JSON, build tooling, package files |

## Production Guard alignment (v4.6 hardening)

`Hosting / HTTPS` is now **BLOCK unless `GITHUB_PAGES_VERIFIED`** (previously
WARN on secure localhost). Rationale: with RLS now PASS-able, the old WARN
could have let the guard declare `PRODUCTION_GUARD_PASSED` in a localhost tab
with a signed-in session — the false-readiness edge flagged in the Fable
review. Detail now states: *"deploy package PREPARED (v4.6); GitHub Pages
NOT_DEPLOYED."* Expected posture after v4.6: **Hosting: PREPARED ·
Pages: NOT_DEPLOYED · Production: BLOCKED.**

## Rollback

- Preparation stage: `deploy/public/` is fully generated — delete and rebuild
  at will; removing the folder reverts everything this strategy created.
- Post-deploy (future): disable Pages or revert the deploy commit → site gone;
  the local app, local data, and Supabase data are untouched. v3.8 backup JSON
  remains the portable escape hatch.

## Next mission

**v4.7 — GitHub Pages activation** (operator-gated): business-content signoff →
re-run build+validator → deliberate artifact commit → enable Pages on the
curated path → verify hosted URL/HTTPS/CSP/auth/persistence → rerun the
technical RLS verification from the hosted origin → guard re-evaluation.
Standing items first: rotate the old Google key; confirm repo visibility
(mandatory before the artifact commit makes the anon key repo-visible).
