# SYS_OS — DEPLOYMENT GUIDE
**Version:** 2.7.0 · Zero-build static platform

## Requirements
- Any static file server (no Node runtime, no build step, no install).
- Network access to `cdn.tailwindcss.com` and `fonts.googleapis.com` /
  `fonts.gstatic.com` (the only external dependencies, both CSP-fenced).
- A secure context (`http://localhost` or HTTPS) for WebCrypto SHA-256.
  On non-secure contexts the vault degrades to labeled FNV-1a hashing —
  functional, but not ledger-grade.

## Local Deployment (canonical)

```powershell
# From the ecosystem root — any static server works. Examples:
npx serve tools/command_deck -l 4173
# or
python -m http.server 4173 --directory tools/command_deck
```

**Pass criteria:** open http://localhost:4173 and check DevTools console for:
```
[SYS_OS] v2.7.0 (PRODUCTION_HARDENING) boot complete — stations: 6, vault docs: 3, ...
```
- Sidebar shows stations 01–06 and badge `SYS_OS v2.7.0`.
- Vault station shows 38 rows, chain meta `CHAIN: 3 ENTRIES · VERIFIED`
  (fresh install; grows with use).

**Error map:**
| Symptom | Cause | Action |
|---|---|---|
| Page is unstyled plain HTML | Tailwind CDN unreachable or CSP edited | Restore the CSP `script-src` entry for `https://cdn.tailwindcss.com`; check network |
| Console: CSP violation reports | A new external resource was added without a CSP grant | Add the origin to the correct directive in index.html, or self-host the resource |
| `boot complete` missing | A module threw before main.js | First console error names the file — fix order or syntax; load order in index.html is the dependency order |
| Vault shows 38 rows but no chain meta | localStorage blocked (private mode) | Expected degradation — engine runs in-memory only |
| Hashes show `fnv1a:` prefix | Non-secure context | Serve via localhost/HTTPS |

## Claude Code Preview (development)
`.claude/launch.json` already defines the `command-deck` server on port 4173.
Capture tooling should call `SYSOS.canvas.freezeFrame()` before screenshots
(animation never idles by design; freeze gives a stable frame), and
`SYSOS.canvas.resume()` after.

## Version Upgrade Procedure (the standing convention)
1. `Copy-Item index.html index_v<current>.html`  — archive BEFORE touching anything.
2. Bump `VERSION` in `assets/js/config.js` (single source — the badge follows).
3. Apply changes; verify boot line + the pass criteria above.
4. Append the release to `docs/VERSION_HISTORY.md`.

## Rollback
Archives are complete, self-contained builds:
```powershell
Copy-Item tools/command_deck/index_v2.6.html tools/command_deck/index.html
```
(v2.6 and earlier are single-file monoliths — they ignore `assets/` entirely.
Rolling back does not require touching the module files.)

## Data Stores
| Key | Contents | Reset |
|---|---|---|
| `localStorage["sysos.vault.v1"]` | Vault documents, audit chain, evidence, OCR queue | `SYSOS.vault.reset()` in console (re-seeds + reverifies) |
| `localStorage["sysos.registry.v1"]` | Reserved (registries are in-memory in v2.7) | n/a |
