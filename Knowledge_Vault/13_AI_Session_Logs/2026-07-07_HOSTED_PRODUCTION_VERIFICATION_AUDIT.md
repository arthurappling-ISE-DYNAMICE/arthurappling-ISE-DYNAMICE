# 2026-07-07 — SYS_OS v4.7.2 Hosted Production Verification Audit

**Mission:** Read-only hosted verification of the live GitHub Pages deployment.
No code changes, no commits, no push, no Pages setting changes.
**Auditor:** Claude Sonnet 5.
**Tooling note:** the Chrome browser automation tool (claude-in-chrome) was
unavailable this session (extension not connected, retried twice). All
findings below come from direct HTTP inspection (`curl`, header/body analysis,
JWT decode) against the live hosted origin — a real, evidence-based method,
but it cannot execute JavaScript. Phases requiring live JS execution (visual
render, browser console, sign-in, persistence, hosted RLS rerun) are marked
**BLOCKED — requires browser session**, not faked as PASS.

---

## 1. Executive Summary

The v4.7.1 gh-pages mechanism worked exactly as designed: the hosted site is
live, serves precisely the validated 51-file artifact (+ `.nojekyll`), every
real asset loads with HTTP 200, the CSP is intact, the anon key present is
independently confirmed to decode to `"role":"anon"` (not a server secret),
and every forbidden path (docs, CLAUDE.md, scripts, archives, `.env`,
`supabase.local.js`) returns 404 as required. **Deployment integrity: PASS.**

Two real findings, both cosmetic/informational, not security issues:
1. The in-app version badge and `config.js` `VERSION` constant still read
   `4.6.0` — stale by two releases (v4.6.0 → v4.7 → v4.7.1 shipped since).
2. The CSP `connect-src` still carries the two localhost origins in the
   production artifact — a previously-known, already-documented LOW finding
   (Fable 5 audit §8) that remains unfixed. Harmless (browser ignores
   unreachable localhost origins) but untidy.

**What is NOT verified this session** (requires a live browser + test
credentials, neither available here): visual rendering, browser console
health, sign-in, remote persistence, hosted-origin RLS technical
verification, and the hosted Production Guard's live displayed state. These
are exactly the items PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md Section H
requires before any "hosting verified" claim — **that claim cannot be made
yet.** This is not a regression; it is the expected next gate, now reachable
only by the operator (or a session with working browser tooling).

---

## 2. Hosted URL

**`https://arthurappling-ise-dynamice.github.io/arthurappling-ISE-DYNAMICE/`**

Derived from `git remote -v` (`arthurappling-ISE-DYNAMICE/arthurappling-ISE-DYNAMICE`)
and confirmed live by direct fetch — not guessed silently.

---

## 3. Ground Truth

| Check | Result |
|---|---|
| Repo root | `C:/Users/arthu/GeminiEcosystem` ✅ |
| Branch | `clean-vault-deployment` ✅ |
| HEAD | `cbeab323cc253558fb4aa8992e317ceda42f34a0` ✅ matches expected `cbeab323` |
| Origin sync | clean-vault-deployment in sync with origin ✅ |
| Staged files | none ✅ |
| gh-pages (local) | exists, `6ebebd75b1445e309a8ed6f7c0ecddb8a86177da` ✅ |
| gh-pages (origin) | exists, same commit `6ebebd75...` ✅ — local and remote identical |
| Tracked `.env` | only `.env.example` templates (4) ✅ |
| `config.local.js` ignore | confirmed via `tools/command_deck/.gitignore:6` ✅ |
| Google API key finding | closed per `docs/CURRENT_STATE.md` / Fable 5 audit addendum — no active tracked key ✅ |

No mismatch. Proceeded.

---

## 4. Page Load Results (Phase 1) — ✅ PASS

| Check | Result |
|---|---|
| `index.html` | HTTP 200, `Content-Type: text/html; charset=utf-8`, size 30,186 bytes |
| HTTPS | Enforced; `Strict-Transport-Security: max-age=31556952` present |
| Repo path without trailing slash | HTTP 301 → correct URL with trailing slash (expected GitHub Pages behavior, not a broken redirect loop) |
| Root with trailing slash | HTTP 200, no further redirect |
| Page title | `PRIME PATHWY // SYSTEM ARCHITECTURE OS` |
| DOM / shell presence | Confirmed via static HTML: Prime Pathwy branding, `data-version` badge, toast-stack container, full script/link tag set present |

## 5. Asset Load Results (Phase 2) — ✅ PASS

Every asset referenced by the live `index.html` was individually requested:

- **40/40 JS modules** — HTTP 200 each (`config.js` through `main.js`, incl.
  `config.public.js`, `supabase.js`, `runtime_config.js`).
- **CSS** — `sys_os.css`, `tailwind.build.css` — HTTP 200.
- **Fonts** — `fonts.css` HTTP 200; all 6 `.woff2` files it references — HTTP
  200 (resolved relative to `/assets/fonts/`, no base-path breakage).
- **Manifest** — `.deploy-manifest.json` HTTP 200, `fileCount: 50` (+ index.html
  + manifest itself = 51, matching the validator's PASS count).

No 404s among real (non-commented) asset references. One apparent 404 —
`assets/js/config.local.js` — was investigated and is **not a defect**: that
path only appears inside an HTML comment in `index.html` (lines 322–328) that
documents how an *operator's private local copy* would wire it in; no live
`<script>` tag requests it. Confirmed by reading the exact HTML context.

## 6. Visual Sanity (Phase 3) — ⚠️ BLOCKED — requires browser session

Cannot render/screenshot without a working browser tool. Static HTML
structure looks complete (sidebar nav markup, command-panel containers,
canvas element, toast stack all present in the DOM source) but layout,
overlap, and responsive behavior cannot be confirmed without rendering.
**Operator action:** open the hosted URL in a real browser and eyeball it —
this is a two-minute check, no special tooling needed.

## 7. Console Health (Phase 4) — ⚠️ BLOCKED — requires browser session

No JS execution available this session. Cannot report runtime errors, CSP
violation reports, or rejected network calls from an actual page load.
**Operator action:** open DevTools console on the hosted URL, hard-refresh,
report anything red/yellow.

## 8. Config / Security Findings (Phase 5 & 6) — ✅ PASS

| Check | Result |
|---|---|
| Runtime config loaded | `config.public.js` present, HTTP 200, well-formed |
| Supabase URL | `https://xwgmbprchzfutlmlymti.supabase.co` — matches the known project ref, browser-safe |
| Anon key | JWT independently decoded (payload only, no signature verification needed for this check): `{"iss":"supabase","ref":"xwgmbprchzfutlmlymti","role":"anon","iat":...,"exp":...}` — **confirmed `role: anon`, not service_role** |
| `service_role` / `sb_secret_` anywhere reachable | none found — scanned `index.html`, `config.js`, `config.public.js` bodies directly |
| Test user credentials / `@primepathwy.local` | none found |
| CSP header | present as a `<meta>` tag (GitHub Pages does not set a CSP HTTP header, so the meta tag is the only enforcement point — same as documented design) |
| CSP `connect-src` | `'self' http://localhost:3132 http://localhost:4173 https://xwgmbprchzfutlmlymti.supabase.co` — hosted Supabase origin correctly scoped in; the two `localhost` entries are inert on the hosted origin (browser can't reach them) but are a known, previously-flagged LOW cosmetic leftover (see §11 Punch List) |
| Mixed content | None possible — every asset URL is relative/same-origin HTTPS |
| Forbidden paths reachable | All probed: `docs/CURRENT_STATE.md`, `CLAUDE.md`, `scripts/build_public_deploy.js`, `test_nemotron_stream.py`, `archives/v4.6.0/index_v4.6.0.html`, `.env`, `assets/js/supabase.local.js` — **all HTTP 404** |

## 9. Authentication (Phase 7) — OPERATOR_REQUIRED

No test credentials were available to this session (correctly — they are not
stored anywhere in the repo per design), and no browser session was available
to exercise sign-in even if they were. **Not faked as PASS.**
**Operator action:** per the Fable 5 audit's documented method (§9): open the
hosted URL, open DevTools console, set
`window.__SYSOS_RUNTIME__.TEST_USERS = {...}` at runtime (never commit this),
sign in as test1, confirm session, sign out, repeat for test2.

## 10. Supabase / Persistence (Phase 8) — BLOCKED (depends on Phase 7)

Cannot run without a signed-in session. Marked blocked, not skipped-as-pass.

## 11. Hosted RLS Technical Verification (Phase 9) — BLOCKED (depends on Phase 7)

Cannot run without a signed-in session. This is the specific gate
`docs/CURRENT_STATE.md` and the operator checklist (Section H) require before
the Hosting guard line may honestly read `GITHUB_PAGES_VERIFIED`. Still
outstanding — **this session did not complete it and does not claim to.**

## 12. Production Guard (Phase 10) — NOT OBSERVABLE this session

The Guard's live displayed state can only be read from a rendered, booted
page. Based on the static evidence gathered (config wired correctly, no
console visibility), the Guard *should* boot to `CONFIGURED` /
`PRODUCTION_BLOCKED` (hosting not yet verified) — consistent with the honest
design — but this is inference, not observation, and is reported as such.

## 13. Deployment Consistency (Phase 11) — ✅ PASS

| Comparison | Result |
|---|---|
| `deploy/public/` (local, rebuilt this session) vs. `gh-pages` branch tree | Identical file set (52 entries incl. `.nojekyll`), confirmed in the v4.7.1 publish run |
| `gh-pages` local vs. `gh-pages` origin | Identical commit hash `6ebebd75...` |
| Hosted `.deploy-manifest.json` | `fileCount: 50` + index.html + manifest = matches validator's 51-file PASS |
| Archives / docs / internal reports / helper scripts reachable | None — all probed paths 404 |
| `config.local.js` / `.env` / `supabase.local.js` reachable | None — all 404 |
| Secrets reachable anywhere on hosted origin | None found |

The gh-pages mechanism is proven end-to-end: what was validated locally is
exactly what is being served publicly.

## 14. Operator Experience Findings (Phase 12)

- The version badge (`SYS_OS v4.6.0`) will read as stale/wrong to anyone who
  has seen the release history — worth bumping before a demo where someone
  might notice, low urgency otherwise.
- Everything else observable from static HTML (nav labels, section structure)
  matches the already-accepted business-content signoff from v4.7 — no new
  content concerns surfaced by this pass.
- The two open BLOCKED phases (console health, auth/RLS rerun) are exactly
  the kind of thing that would embarrass an operator mid-demo if skipped —
  recommend actually doing the two-minute manual console check before showing
  anyone the URL, even though nothing here suggests a problem.

## 15. Punch List (Phase 13)

| Priority | Item | Evidence | Location | Impact | Fix | Blocks next phase? |
|---|---|---|---|---|---|---|
| **Medium** | Version badge/constant stale (`4.6.0`, should be `4.7.1`) | `data-version` span in `index.html:44`; `VERSION: '4.6.0'` in `config.js:11` | `tools/command_deck/index.html`, `tools/command_deck/assets/js/config.js` | Cosmetic confusion in demo/audit contexts; no functional effect | Bump `VERSION`/`PREVIOUS_VERSION` constants and rebuild the artifact before next demo | No |
| **Low** | CSP `connect-src` retains two localhost origins in production artifact | Live CSP meta tag on hosted `index.html` | `tools/command_deck/index.html` CSP meta (source), inherited into `deploy/public/index.html` by the builder | None functionally (browser can't reach localhost from a public origin); previously flagged in Fable 5 audit §8 as LOW/cosmetic | Strip localhost entries specifically from the *public build* CSP in `build_public_deploy.js`'s HTML transform step | No |
| **Info (not a defect)** | `config.local.js` HTML comment reads as a live reference at a glance | `index.html` lines 322–328 | `tools/command_deck/index.html` | None — verified it's inert documentation, not a script tag | No action required; noted so a future auditor doesn't re-flag it without checking context | No |
| **Blocked (tooling)** | Visual/console/auth/persistence/hosted-RLS verification not run | No browser session available this audit | N/A | Cannot claim "hosting verified" until done | Operator (or a session with working browser tools) completes Phases 6–11 above per the existing checklist method | **Yes — blocks any "GITHUB_PAGES_VERIFIED" claim** |

No Critical or High findings. Nothing here blocks continuing to use the
public pilot as a demo of the deployment mechanism itself; the outstanding
item is the same one already known before this session — full hosted
verification (auth + RLS rerun) is still pending, by design, pending operator
action.

## 16. Productization Readiness (Phase 14)

- **Live?** Yes — confirmed by direct HTTP fetch, HTTPS, correct content.
- **Demo-visible?** Yes — a human can open the URL right now and see the
  shell render (pending the 2-minute manual visual/console spot-check above).
- **Demo-safe?** Provisionally yes for the deployment/architecture story;
  hold off demoing the *live backend* (sign-in, persistence) until Phases 7–9
  are completed, since those are unverified, not merely unpolished.
- **Client-ready?** No — unchanged from the 2026-07-06 Fable 5 audit's
  finding: this is a single-operator deck, not a multi-tenant product
  (seed/identity separation, onboarding, and support are still the real gap).
- **Monetization-ready?** No — same reason; nothing in this session changes
  that assessment.

## 17. Recommended Next Mission

**v4.7.2 operator completion — hosted auth + RLS rerun.** The only remaining
step to honestly claim "GitHub Pages hosting verified": open the hosted URL
in a real browser, run the manual console check, sign in as test1/test2 via
the DevTools `TEST_USERS` runtime-injection method (Fable 5 audit §9), run
the Station 15 "Run Technical RLS Verification" button from the hosted
origin, and confirm the Production Guard's Hosting line flips to
`GITHUB_PAGES_VERIFIED`. This requires either the operator directly, or a
future session with a connected browser tool — it does not require further
code changes.

After that: the version-badge bump (Medium) and CSP localhost cleanup (Low)
from the punch list are small, safe follow-ups; everything else stays parked
per the constitution (Graphify, NVIDIA, MCP, Orbit, client onboarding).

---

*No secrets printed or reconstructed. No code changed. No commits made. No
push performed. GitHub Pages settings untouched.*
