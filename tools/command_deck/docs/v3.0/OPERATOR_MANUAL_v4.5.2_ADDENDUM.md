# SYS_OS v4.5.2 — Operator Manual Addendum (ACTIVATION_ENABLEMENT_VALIDATOR_HARDENING)

Additive to v4.4.3. LOCAL mode unchanged. No new panels or buttons — this build
changes what SYS_OS *accepts and refuses*, not what you see.

---

## What changed for you as operator

### Your new Supabase key will now work
When you create the Supabase project (resuming mission v4.5.1), the dashboard
will likely issue a key starting with **`sb_publishable_`**. v4.4.3 would have
rejected it; v4.5.2 accepts it. Both key generations are valid in
`config.local.js`:

- `eyJ…` (legacy JWT anon key) ✔
- `sb_publishable_…` (new publishable key) ✔
- `sb_secret_…` → **refused (BLOCK)** — that is the server-only secret; if you
  see this prefix in your config you copied the wrong row from Settings → API.
- anything mentioning `service_role` → **refused (BLOCK)** — same reason.

### The CSP check is stricter (and now trustworthy)
`CSP Supabase origin = PASS` now means the origin is inside the **`connect-src`**
directive specifically — the only place that actually permits API calls. Pasting
the origin into the wrong directive, or using a wildcard, now correctly shows
BLOCK with the exact line to add:
```
connect-src 'self' https://YOUR_PROJECT_REF.supabase.co
```

### RLS "technically verified" can no longer arrive by import
Restoring a backup (or pulling from remote) that contains a
`TECHNICALLY_VERIFIED` RLS status will automatically downgrade it to
**"technical verification required"** and log an audit event. This is
intentional: technical RLS proof is only valid on the machine where the
verification actually ran. Your business data in backups is completely
unaffected — only this one control key is sanitized.

### `ENVIRONMENT_PROFILE` removed from the config template
It never did anything (the field was not read by the profile detector). Set the
profile via the **Station 15 selector** or a `?profile=STAGING` URL parameter,
as before. If you already created a `config.local.js` from the old template,
the leftover field is harmless — it is simply ignored.

## Resuming live activation (v4.5.1)
Pick up exactly where the mission stopped: create the Supabase project
(Phase 3), and this time the `sb_publishable_` key will validate. All other
v4.5.1 instructions and safety rules are unchanged: anon/publishable key only,
never commit `config.local.js`, never paste keys into chat.
