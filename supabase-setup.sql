-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  archetype_code text not null,
  created_at    timestamptz not null default now()
);

-- Optional: prevent duplicate emails
create unique index if not exists leads_email_unique on leads (email);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow the anon key to INSERT only (reads are server-side only)
create policy "leads_insert" on leads
  for insert
  to anon
  with check (true);
