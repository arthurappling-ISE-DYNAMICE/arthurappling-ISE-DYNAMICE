# SYS_OS v4.6 — Public Deployment Operator Checklist

The exact, gated sequence for taking SYS_OS public later. **Nothing on this
page has been executed** — v4.6 only prepared the machinery. Every actionable
step below is Exact Command + Pass Criteria + Error Map, per the constitution.

---

## A. Build the deploy package

**Command** (PowerShell or terminal):
```
cd C:\Users\arthu\GeminiEcosystem\tools\command_deck
node scripts\build_public_deploy.js
```
**Pass criteria:** prints `BUILD OK — REMOTE (public config included)` with your
masked origin, ~50 files.
**Error map:** `REFUSED — SERVER SECRET` → your local config holds a
sb_secret_/service_role key — replace with the anon key, never deploy that ·
`missing runtime module` → repo incomplete, run from a clean checkout ·
`LOCAL-ONLY` mode → `config.local.js` absent; fine for a demo shell, no remote.

## B. Validate it

**Command:** `node scripts\validate_public_deploy.js`
**Pass criteria:** `VALIDATION PASS — … all on allowlist, zero forbidden names/content.`
**Error map:** any `✗` line names the offending file and rule — delete the file
(or rebuild) and re-run. **Never deploy after a FAIL. Never hand-edit the
artifact to silence the validator.**

## C. Inspect for forbidden material (manual spot-check)

```
dir deploy\public /s /b
```
**Pass criteria:** you see only: `index.html`, `.deploy-manifest.json`,
`assets\css\*` (2), `assets\fonts\*` (8), `assets\js\*` (40: 38 modules +
supabase.js + config.public.js). Anything else → STOP, rebuild, re-validate.

Confirm no secrets beyond the intentional anon key:
```
findstr /s /i "sb_secret_ service_role TEST_USERS password" deploy\public\*.js deploy\public\*.html
```
**Pass criteria:** no output (the anon key does not match these patterns).

## D. 🔴 BUSINESS-CONTENT SIGNOFF (owner decision — cannot be delegated)

The public page will display: your name and title, DSCR 7.42×, $130,000
capital allocation, consulting pipeline figures, and business-flavored records.
**Check one:**
- [ ] I accept these being on the public internet → proceed
- [ ] I do NOT accept → STOP. Commission a de-identified public variant first.

## E. Pre-deploy standing items (must be done before F)

- [ ] Old Google API key rotated (v4.4.1 finding).
- [ ] Repo visibility confirmed on GitHub (Settings → General). If **public**,
      understand: committing the artifact makes the anon key repo-visible
      immediately (browser-safe by design + RLS verified — but conscious).
- [ ] RLS status is current (Station 15 → green, not stale; else rerun
      "Run Technical RLS Verification").

## F. Deliberate artifact commit (this is the exposure moment)

1. Edit `tools/command_deck/.gitignore` → delete the single line `deploy/public/`.
2. `git add tools/command_deck/deploy/public/ tools/command_deck/.gitignore`
3. Re-run step B one final time. PASS required.
4. `git status` — **pass criteria:** staged set is ONLY deploy/public/* + .gitignore.
5. Commit: `git commit -m "deploy(sysos): publish curated public artifact"`
6. Push only with explicit authorization, per the constitution.

## G. Enable GitHub Pages (only after F is pushed)

Repo → Settings → Pages → Source: Deploy from a branch →
Branch: `clean-vault-deployment`, folder: none of the offered roots will point
at the nested artifact directly — **expected**: if the folder picker only
offers `/ (root)` and `/docs`, STOP and report back: the v4.7 mission will cut
a dedicated `gh-pages` branch whose ROOT is a copy of `deploy/public/`
(one command, already anticipated). Do not publish the repo root under any
circumstances.

## H. Post-deploy verification (hosted URL)

- Page loads over **https://…github.io/…** with the padlock.
- Station 15: Hosting line flips to PASS (`GITHUB_PAGES_VERIFIED`).
- Station 16: Check Remote Health → sign in test1 → PASS.
- Run Technical RLS Verification **from the hosted origin** → green.
- Browser console: zero CSP violations.

## Stop conditions (any → halt, report, don't improvise)

Validator FAIL · unexpected file in artifact · signoff D unchecked · repo
visibility unknown · sb_secret_/service_role anywhere · Pages folder picker
mismatch (expected — becomes v4.7) · console CSP errors on hosted URL ·
guard claims READY anywhere before H completes.
