-- Migration 003: share_events table
-- Track share button clicks per channel for effectiveness measurement

-- Channel enum
create type share_channel as enum ('pinterest', 'x', 'facebook', 'whatsapp', 'download');

-- share_events: one row per share button click
create table share_events (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles(id) on delete set null, -- nullable for unauthenticated users
  channel       share_channel not null,
  reading_type  text not null check (reading_type in ('horoscope', 'reading', 'tarot', 'weekly')),
  created_at    timestamptz not null default now()
);

create index idx_share_events_channel      on share_events(channel);
create index idx_share_events_created_at   on share_events(created_at desc);
create index idx_share_events_user_id      on share_events(user_id) where user_id is not null;
create index idx_share_events_reading_type on share_events(reading_type);

alter table share_events enable row level security;

-- Anyone (including anon) can insert
create policy "share_events_insert_any" on share_events
  for insert with check (true);

-- Authenticated users can read their own events
create policy "share_events_select_own" on share_events
  for select using (auth.uid() = user_id);
