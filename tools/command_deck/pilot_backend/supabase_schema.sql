-- SYS_OS v4.0 — Pilot Backend Schema (Supabase / Postgres)
-- =========================================================
-- Durable, per-user key/value store for SYS_OS `sysos.*` state blobs.
-- The backend stores OPAQUE strings only — vault hash chains and the central
-- audit are computed and verified CLIENT-SIDE. The backend never re-implements
-- SYS_OS logic; it authenticates a user and durably stores/serves their blobs.
--
-- SECURITY: Row-Level Security (RLS) enforces per-user isolation at the DATABASE.
-- Use ONLY the Supabase ANON key in the frontend. NEVER expose the service-role
-- key to the browser. Paste this whole file into Supabase → SQL Editor → Run.

-- ----------------------------------------------------------------------------
-- 1. State table: one row per (user, storage_key)
-- ----------------------------------------------------------------------------
create table if not exists public.sysos_kv_state (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users (id) on delete cascade,
    storage_key   text not null,
    storage_value text not null,                 -- opaque SYS_OS blob (JSON string)
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now(),
    unique (user_id, storage_key)
);

comment on table public.sysos_kv_state is
    'SYS_OS per-user key/value state blobs (sysos.* keys). Opaque to the backend.';

create index if not exists sysos_kv_state_user_idx       on public.sysos_kv_state (user_id);
create index if not exists sysos_kv_state_user_key_idx   on public.sysos_kv_state (user_id, storage_key);

-- keep updated_at fresh on every update
create or replace function public.sysos_touch_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists sysos_kv_state_touch on public.sysos_kv_state;
create trigger sysos_kv_state_touch
    before update on public.sysos_kv_state
    for each row execute function public.sysos_touch_updated_at();

-- ----------------------------------------------------------------------------
-- 2. Optional backup-event log (lightweight audit of backup/sync actions)
-- ----------------------------------------------------------------------------
create table if not exists public.sysos_backup_events (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    backup_id   text,
    event_type  text not null,                   -- export_created | restore_completed | sync_to_remote | ...
    summary     jsonb,
    created_at  timestamptz not null default now()
);

comment on table public.sysos_backup_events is
    'Lightweight per-user log of backup/sync events (no sensitive payloads).';

create index if not exists sysos_backup_events_user_idx on public.sysos_backup_events (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 3. Row-Level Security — per-user isolation (the security crux: server-side authz)
-- ----------------------------------------------------------------------------
alter table public.sysos_kv_state      enable row level security;
alter table public.sysos_backup_events enable row level security;

-- sysos_kv_state policies: a user may only touch their OWN rows.
drop policy if exists sysos_kv_select on public.sysos_kv_state;
create policy sysos_kv_select on public.sysos_kv_state
    for select using (auth.uid() = user_id);

drop policy if exists sysos_kv_insert on public.sysos_kv_state;
create policy sysos_kv_insert on public.sysos_kv_state
    for insert with check (auth.uid() = user_id);

drop policy if exists sysos_kv_update on public.sysos_kv_state;
create policy sysos_kv_update on public.sysos_kv_state
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists sysos_kv_delete on public.sysos_kv_state;
create policy sysos_kv_delete on public.sysos_kv_state
    for delete using (auth.uid() = user_id);

-- sysos_backup_events policies: same per-user isolation.
drop policy if exists sysos_be_select on public.sysos_backup_events;
create policy sysos_be_select on public.sysos_backup_events
    for select using (auth.uid() = user_id);

drop policy if exists sysos_be_insert on public.sysos_backup_events;
create policy sysos_be_insert on public.sysos_backup_events
    for insert with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. Verification (run after creating, expect rowsecurity = true for both)
-- ----------------------------------------------------------------------------
-- select relname, relrowsecurity from pg_class
--   where relname in ('sysos_kv_state','sysos_backup_events');
-- select tablename, policyname, cmd from pg_policies
--   where tablename in ('sysos_kv_state','sysos_backup_events') order by tablename, cmd;
