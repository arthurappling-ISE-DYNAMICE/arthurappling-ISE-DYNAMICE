# SYS_OS Architecture Principles

- **Frontend dashboard** — the visible interface (`tools/command_deck/`).
  Should stay stable even as the engine underneath changes.
- **Supabase backend** — data persistence and auth provider. Frontend uses
  anon/publishable keys only; secret keys never touch browser code.
- **Authentication** — real user accounts, not shared/shared-secret access.
- **Persistence** — data survives sessions and reloads; verified per release.
- **RLS isolation** — Row Level Security ensures one user's data cannot be
  read or written by another. Never weakened or bypassed for convenience.
- **Production Guard** — reports real, machine-verified state only. Never
  reports an aspirational or assumed PASS.
- **Deployment validation** — every release proves prior PASSes still hold
  (regression proof) before shipping further.
- **Public/private hosting boundary** — public hosting exposes only a
  curated deploy artifact; archives, internal docs, and business metrics
  never ship to a public host.
- **Future MCP / AI model integration** — parked until it strengthens
  SYS_OS; the platform is designed so models and connectors can be swapped
  without rearchitecting the core.
- **Stable interface, stronger engine underneath** — the operator-facing
  dashboard should feel consistent even as backend engines evolve.
