-- BazaarSaathi -- Supabase schema for vendor login + Bazaar Chat.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- Auth itself is handled by Supabase's built-in `auth.users` table (nothing
-- to create for that). This adds:
--   1. `profiles`  -- one row per signed-up vendor (stall name, item sold)
--   2. `messages`  -- Bazaar Chat, readable by everyone, postable only by
--      signed-in vendors, live via Supabase Realtime.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stall_name text not null default 'New Vendor',
  item text not null default 'Vada Pav',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "vendors can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "vendors can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);


create table if not exists public.messages (
  id bigint generated always as identity primary key,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_name text not null,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages are readable by everyone"
  on public.messages for select
  using (true);

create policy "signed-in vendors can post messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Enable Realtime on messages so Bazaar Chat updates live for every viewer.
alter publication supabase_realtime add table public.messages;
