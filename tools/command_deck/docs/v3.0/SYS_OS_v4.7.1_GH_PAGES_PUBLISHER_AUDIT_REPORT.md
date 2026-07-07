# SYS_OS v4.7.1 — GH-PAGES PUBLISHER AUDIT REPORT

**Type:** Engineering + audit. Code was written and executed (build, validate,
publish-to-local-branch). **NO push to origin, NO GitHub Pages enablement, NO
secrets printed, NO Supabase/RLS changes.** All git operations affecting the
`gh-pages` branch used plumbing commands against a temp index and a throwaway
staging directory — the working tree, the main index, and the current branch
(`clean-vault-deployment`) were never touched.

**Date:** 2026-07-07 · **Baseline:** HEAD `3039b790` (v4.7 Google API key security closeout)

---

## 1. Executive Summary

v4.7 left the public pilot artifact committed but with no mechanism to get it
onto GitHub Pages, because the repo's branch-folder picker only supports
publishing from the root or a `/docs` folder — neither of which matches the
allowlist-curated `deploy/public/` artifact without either polluting the repo
root or restructuring the whole project. v4.7.1 closes that gap with an orphan
`gh-pages` branch whose root is **exactly** the validated artifact.

`scripts/publish_pages_branch.js` was built, run, and its output independently
re-verified. Local branch `gh-pages` now exists with 52 files (51 validated
artifact files + `.nojekyll`) and **has not been pushed anywhere**.
**Recommended decision: GO — operator gate only remaining.** The three
remaining steps (push, enable Pages, hosted verification) are unchanged from
the v4.6 checklist and are explicitly reserved for Arthur.

---

## 2. Ground Truth (Phase 1) — ✅ ALL PASS

| Check | Result |
|---|---|
| Repo root | `C:/Users/arthu/GeminiEcosystem` ✅ |
| Branch | `clean-vault-deployment` ✅ |
| HEAD (session start) | `3039b79065a4bdb897ccee10d1685db513b0e761` ✅ matches handoff |
| Origin sync | ahead 0 / behind 0 ✅ |
| Last 5 commits | `3039b790` (Google key closeout) → `20cf622c` (Fable 5 audit) → `56b3ed64` (Knowledge Vault) → `8401805f` (AI session logs) → `0ad30c31` (v4.7 public pilot artifact) ✅ |
| Staged | nothing ✅ |
| Tracked `.env` files | only `.env.example` templates (4) ✅ |
| Tracked `config.local.js` (real) | 0 — only `config.local.example.js` templates ✅ |
| `config.local.js` git-ignore | confirmed via `tools/command_deck/.gitignore:6` ✅ |
| Pre-existing `gh-pages` branch (local or origin) | none — confirms NOT_DEPLOYED ✅ |

No baseline drift. Proceeded per operator approval.

## 3. Build + Validate (Phase 2) — ✅ PASS

```
node scripts/build_public_deploy.js
> BUILD OK — REMOTE (public config included)
>   files: 50 · sdk: true · origin: https://xwgm***.supabase.co

node scripts/validate_public_deploy.js
> VALIDATION PASS — 51 files, all on allowlist, zero forbidden names/content.
```

Rebuild is reproducible: re-running the builder twice back-to-back produced
identical output apart from `.deploy-manifest.json`'s `builtAt` timestamp.

## 4. Publisher Script (Phase 3)

`tools/command_deck/scripts/publish_pages_branch.js` — six-stage pipeline,
abort-on-failure at every stage:

1. **BUILD** — invokes `build_public_deploy.js` as a subprocess.
2. **VALIDATE** — invokes `validate_public_deploy.js` as a subprocess.
3. **STAGE** — copies `deploy/public/` to an OS temp directory and adds
   `.nojekyll` (tells GitHub Pages to serve dotfiles like the manifest as-is
   instead of running Jekyll, which would otherwise silently drop them).
4. **RESCAN** — an independently written sweep (deliberately duplicated rules,
   not a call into the validator) for forbidden names, server-secret content,
   test-credential patterns, and keys outside `config.public.js`. This exists
   so a future regression in the validator cannot silently open this gate.
5. **COMMIT** — pure git plumbing: `git add -f -A` against a temp
   `GIT_INDEX_FILE` pointed at the staging tree, `write-tree`, `commit-tree`
   (parented onto the previous `gh-pages` HEAD if one exists, else an orphan
   root), `update-ref refs/heads/gh-pages`. The real working tree and index are
   never referenced.
6. **VERIFY** — `git ls-tree -r --full-tree gh-pages` is diffed against the
   staged file list; any mismatch fails the run after the fact and instructs
   the operator not to push.

**No line in this script calls `git push`.**

## 5. Execution Result — ✅ PASS

```
[1/6] BUILD    — BUILD OK — REMOTE, 50 files
[2/6] VALIDATE — VALIDATION PASS — 51 files
[3/6] STAGE    — copied to temp dir
[4/6] RESCAN   — rescan clean: 52 files (incl. .nojekyll)
[5/6] COMMIT   — plumbing commit onto local gh-pages
[6/6] VERIFY   — branch tree matches staging exactly

PUBLISH OK — local branch "gh-pages" now points at 6ebebd75b1
  files: 52 (validated artifact + .nojekyll) · parent: none (orphan root)
  NOT PUSHED. Nothing left this machine.
```

**One bug found and fixed during this run:** the first execution's VERIFY step
falsely reported all 51 files "missing from branch." Root cause: `git ls-tree
-r` run while the process cwd was `tools/command_deck/` scopes the walk to
that subdirectory's tree prefix, so root-level paths in the branch (which has
no `tools/command_deck/` prefix — its root **is** the artifact root) never
matched. Fixed by adding `--full-tree`. Re-run after the fix passed cleanly;
the false-fail branch was deleted (`git branch -D gh-pages`) and rebuilt from
scratch before the final run recorded above.

## 6. Independent Post-Build Verification (Phase 4) — ✅ PASS

Run from the session, outside the publisher script, directly against the
resulting `gh-pages` branch object (no working-tree checkout):

| Check | Command | Result |
|---|---|---|
| File count | `git ls-tree -r --full-tree gh-pages --name-only \| wc -l` | 52 ✅ |
| Real secret assignments | `git grep -n -E "sb_secret_[A-Za-z0-9]" gh-pages` | 0 matches ✅ |
| Real service_role assignment | `git grep -n -E 'service[_-]?role["\047]?\s*[:=]\s*["\047][A-Za-z0-9]' gh-pages` | 0 matches ✅ |
| Broad `service_role`/`sb_secret_` mentions | `git grep -l -E "service[_-]?role\|sb_secret_" gh-pages` | 4 files, all confirmed to be defensive validator/guard code (comments + `BLOCK` branches in `config.js`, `config.public.js`, `remote_backend.js`, `runtime_config.js`) — no live secret material |
| Anon/publishable key location | `git grep -l` for the key pattern | present **only** in `assets/js/config.public.js` ✅ (matches v4.6 design — safe by RLS) |
| Test-user email / credential residue | pattern scan for `@primepathwy.local`, `PASTE_TEST` | 0 matches ✅ |
| Working tree / current branch | `git branch --show-current` | `clean-vault-deployment` (unchanged) ✅ |

## 7. Posture After v4.7.1

| Area | State |
|---|---|
| Public deploy artifact | Rebuilt, validator PASS, unchanged design from v4.6/v4.7 |
| gh-pages mechanism | **COMPLETE** — `scripts/publish_pages_branch.js`, re-runnable, idempotent, push-free |
| gh-pages branch | **BUILT LOCALLY**, orphan root = validated artifact + `.nojekyll`, 52 files, secret-scan clean |
| Pushed to origin | **NO** |
| GitHub Pages | **NOT_DEPLOYED** |
| Production Guard | Unchanged — still honestly BLOCKED pending hosted verification |
| CLAUDE.md | Version/next-mission block corrected (was stale at v4.5.4 / "next: v4.6") |

## 8. Remaining Steps (Operator-Gated — NOT executed by this session)

1. `git push origin gh-pages`
2. GitHub → repo → Settings → Pages → **Build and deployment** → Source:
   Deploy from a branch → Branch: `gh-pages` → Folder: `/ (root)` → **Save**.
3. Hosted verification per `PUBLIC_DEPLOYMENT_OPERATOR_CHECKLIST_v4.6.md` step
   H: HTTPS, assets load, CSP, Supabase config, auth, persistence, hosted-origin
   RLS technical verification rerun, zero console errors. Only after this
   evidence exists may the Production Guard's Hosting line move off BLOCK.

## 9. What Was Not Touched

Supabase configuration, RLS policies/logic, `config.local.js`, any `.env`
file, NVIDIA/Graphify/MCP/Orbit/client-onboarding parked items, and all
unrelated pre-existing untracked files in the working tree.
