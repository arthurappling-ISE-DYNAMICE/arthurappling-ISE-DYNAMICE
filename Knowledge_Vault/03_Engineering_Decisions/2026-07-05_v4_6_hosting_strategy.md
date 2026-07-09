# v4.6 Hosting Strategy Fix

- **Date:** 2026-07-05
- **Decision:** v4.6 Hosting Strategy Fix — define how SYS_OS gets safely
  hosted publicly without exposing internal material.
- **Context:** Production is blocked solely on hosting strategy. Supabase
  connection, auth, persistence, and RLS isolation are all already verified
  (see root `CLAUDE.md` verified state table).
- **Options considered:**
  - Publish the full repo root as-is.
  - Build a curated deploy artifact containing only what the public site
    needs.
- **Chosen approach:** Use a curated deploy artifact rather than publishing
  the repo root.
- **Reason:** Prevents accidental exposure of archives, internal audit
  reports, helper/debug scripts, and business metrics that live alongside
  the dashboard code in the working repo.
- **Exclusions from the public artifact:** archives, `docs/` internal
  reports, helper scripts, and any business-metric content.
- **Validation:** deploy artifact must pass a pre-publish check before it is
  made public — no unvalidated pushes to a public host.
- **Risks:** a curated artifact can drift from the source repo if not
  regenerated carefully; must be rebuilt from source each release, not
  hand-edited.
- **Rollback:** if a public deploy exposes something it shouldn't, take the
  host down immediately and revert to the last known-good curated artifact.
- **Status:** Decided — hosting itself remains **not yet approved** per root
  `CLAUDE.md` Hosting Rules. GitHub Pages stays blocked until this strategy
  is fully implemented and verified.
- **Next step:** gh-pages branch activation (do not start without
  explicit authorization — see Hosting Rules).
