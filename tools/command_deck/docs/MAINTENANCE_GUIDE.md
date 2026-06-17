# SYS_OS — MAINTENANCE GUIDE
**Version:** 2.7.0

## Golden Rules
1. **No magic numbers.** Every constant goes in `assets/js/config.js`. If you
   are typing a number into any other file, stop.
2. **No `innerHTML` with anything user-typed.** User input flows through
   `SYSOS.utils.el()` / `textContent` only. Template literals fed to
   `innerHTML` may contain frozen config values exclusively.
3. **No inline `onclick`.** New buttons get `data-action="name"` and a handler
   in the `actions` map in `main.js`.
4. **No new alert().** Use `SYSOS.utils.notify(title, lines)`.
5. **Archive before upgrade.** `index_v<version>.html` snapshot first, always.

## Common Tasks

### Change a headline metric (DSCR, capital, pipeline, horizon)
Edit `CONFIG.METRICS` in config.js. Done — markup binds via `[data-metric]`.

### Change agent console copy / presets / responses
Edit `SYSOS.PROTOCOLS` in config.js. The terminal engine is content-agnostic;
add a `{ match, reply }` pair to `responses` for new routed answers.

### Add a station
```js
SYSOS.router.register({ id: 'x', label: '07 // X', render(panel) { ... } });
```
Call it from main.js boot (after registriesInit). Registry Grid (station 06)
is the working reference.

### Add a registry entry at runtime
```js
SYSOS.registries.projects.register({ id: 'new_proj', name: 'New Project', ref: 'path/', status: 'ACTIVE' });
```
Note: in-memory in v2.7 — code-seed permanent entries in registry.js `seed()`.

### Add a vault classification
Add a `{ code, label, test: /regex/ }` row to `CLASSIFICATIONS` in vault.js.
Order matters — first match wins.

### Hook the ingestion pipeline
```js
SYSOS.vault.use('classify', doc => { /* inspect/augment doc */ });
```
Stages: `intake`, `classify`, `hash`, `index`, `seal`. Hooks must not throw —
failures are caught and logged, not fatal.

### Connect a real OCR provider (future)
```js
SYSOS.vault.registerOCRProvider({ name: 'tesseract-local' });
```
Promotes every `AWAITING_PROVIDER` document to `QUEUED` and returns counts.
Processing the queue is the provider's contract (v2.8 roadmap).

## Diagnostics (browser console)
| Command | Returns |
|---|---|
| `SYSOS.canvas.status()` | run state, fps target, pause reason |
| `SYSOS.vault.verifyChain()` | `{valid, length, brokenAt}` — full recompute |
| `SYSOS.vault.search('term')` | matching documents |
| `SYSOS.vault.exportState()` | full JSON snapshot for handoff/backup |
| `SYSOS.vault.reset()` | wipe + re-seed (destructive; chain restarts) |
| `SYSOS.registries.<domain>.stats()` | totals by status |

## Known Limitations (accepted for v2.7)
- Tailwind ships via pinned CDN, not compiled — requires `style-src
  'unsafe-inline'` in CSP and network access at load. Local compile is the
  v3.0 path (see FUTURE_ROADMAP.md).
- Registries do not persist runtime registrations.
- Node "PING" telemetry is simulated — no real fetch to ports 3132/4173
  (`connect-src 'self'` is already in place for when it becomes real).
- Single-operator localStorage store; no multi-device sync.

## Verification Checklist (run after ANY change)
1. Console shows the `boot complete` line, zero errors.
2. All six stations switch; active gold bar follows.
3. CEO terminal: type a command, press **Enter** — response within ~500ms.
4. Vault: `+ INGEST_SPEC_DOCUMENT` → counter +1, toast, chain stays VERIFIED.
5. Reload → vault docs persist, chain re-verifies.
6. `SYSOS.canvas.freezeFrame()` → screenshot succeeds → `SYSOS.canvas.resume()`.
