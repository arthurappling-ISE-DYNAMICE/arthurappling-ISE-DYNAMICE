# SYS_OS v4.4.3 — Operator Manual Addendum (ARCHITECTURE_CLEANUP_RLS_HARDENING)

Additive to v4.3. LOCAL mode unchanged. No new stations or panels — the existing
**Station 15 // ENVIRONMENT** Deployment Readiness panel now reports more honestly.

---

## What changed for you as operator

### RLS button relabeled — same button, honest name
The button previously called **"Record RLS Verified"** is now
**"Record RLS Operator Attestation"**. Clicking it does the same thing it always
did technically (marks that you completed the 12-step checklist) — but it now
**never claims a technical PASS**. The Production Guard will show:

> **WARN** — "Operator attested; technical RLS verification still required."

This is intentional. Completing the checklist yourself is real and valuable, but it
is not the same as an automated, provable test that User A truly cannot read User
B's data. The guard now says exactly that instead of blurring the two.

### RLS statuses you may see
| Status | Meaning |
|---|---|
| `CONFIG_REQUIRED` | No live Supabase configured — the default in LOCAL mode |
| `CHECKLIST_STARTED` | You opened "Run RLS Isolation Checklist" |
| `OPERATOR_ATTESTED` | You clicked "Record RLS Operator Attestation" after completing the checklist |
| `TECHNICALLY_VERIFIED` | Not yet possible in this build — reserved for a future automated test |

### New Supabase config validation
If you later configure `config.local.js` with a real Supabase URL/key, SYS_OS now
checks the **shape** of what you entered before treating it as configured:
- URL must be `https://<ref>.supabase.co` — a typo, localhost, or non-Supabase host
  is now caught and reported as `CONFIG_INVALID`, not silently accepted.
- The anon key must look JWT-shaped. If it looks like you pasted a service-role
  key by mistake (contains "service_role" in the value), SYS_OS reports **BLOCK**
  and will not treat it as valid — this is a safety net, not a substitute for care.
- No key values are ever printed or logged anywhere in this check.

### Hosting readiness is now consistent
The Deployment Readiness panel and the Production Guard read hosting/HTTPS status
from the same place. They will never show you contradictory information again.

## Nothing else changed
Backup, remote sync, commercial UI, client editing, monitoring, audit, vault — all
identical to v4.3. No new build is required to continue toward the live pilot; the
next real step is still the operator infrastructure checklist from v4.4.2/v4.4.3's
predecessor docs (Supabase project, GitHub Pages, live RLS test) whenever you're
ready to begin it.
