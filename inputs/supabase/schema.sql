-- Inputs habit tracker — cloud sync schema.
--
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query →
-- paste this whole file → Run. It creates a single table that holds each user's
-- app data as one JSON blob, locked down with row-level security so a user can
-- only ever read or write their own row.

create table if not exists public.app_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_data enable row level security;

-- Each policy is scoped to the currently authenticated user (auth.uid()).
-- Using "if not exists" guards make this script safe to re-run.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_data' and policyname = 'read own data'
  ) then
    create policy "read own data" on public.app_data
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_data' and policyname = 'insert own data'
  ) then
    create policy "insert own data" on public.app_data
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'app_data' and policyname = 'update own data'
  ) then
    create policy "update own data" on public.app_data
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
