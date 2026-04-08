-- Stellara DB Schema
-- Phase 1 MVP — Supabase (PostgreSQL)
-- Apply via Supabase Dashboard SQL Editor or supabase db push
--
-- Prerequisites: Supabase Auth enabled (provides auth.users table)

-- =============================================================
-- Extensions
-- =============================================================
create extension if not exists "uuid-ossp";

-- =============================================================
-- Types
-- =============================================================
create type sun_sign as enum (
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
);

create type plan_type as enum ('free', 'pro');
create type reading_type as enum ('personal', 'tarot', 'compatibility', 'chat');
create type session_type as enum ('chat', 'tarot', 'personal');
create type message_role as enum ('user', 'assistant');
create type consent_type as enum ('terms_and_privacy', 'eu_art16m', 'entertainment_disclaimer');

-- =============================================================
-- Tables
-- =============================================================

-- profiles: extends auth.users with astrology-specific data
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  birth_date  date not null,
  birth_time  time,
  birth_place text,
  sun_sign    sun_sign not null,
  plan        plan_type not null default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text not null default 'none',
  subscription_period_end timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz  -- soft delete (null = active)
);

-- readings: individual reading results
create table readings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  type            reading_type not null,
  content         text not null,
  prompt_version  text not null,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

-- sessions: conversation sessions (chat, tarot, personal)
create table sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        session_type not null,
  turn_count  int not null default 0,
  turn_limit  int not null,
  created_at  timestamptz not null default now(),
  ended_at    timestamptz
);

-- session_messages: individual messages within a session
create table session_messages (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid not null references sessions(id) on delete cascade,
  role        message_role not null,
  content     text not null,
  token_count int,
  created_at  timestamptz not null default now()
);

-- daily_horoscopes: pre-generated daily horoscopes (12 signs × date)
create table daily_horoscopes (
  id              uuid primary key default uuid_generate_v4(),
  sign            sun_sign not null,
  date            date not null,
  content         text not null,
  prompt_version  text not null,
  created_at      timestamptz not null default now(),
  unique (sign, date)
);

-- consent_records: GDPR consent audit trail
create table consent_records (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  consent_type  consent_type not null,
  ip_address    inet not null,
  country_code  char(2),
  consented_at  timestamptz not null default now()
);

-- =============================================================
-- Indexes
-- =============================================================
create index idx_readings_user_id on readings(user_id);
create index idx_readings_created_at on readings(created_at desc);
create index idx_sessions_user_id on sessions(user_id);
create index idx_session_messages_session_id on session_messages(session_id);
create index idx_daily_horoscopes_date on daily_horoscopes(date);
create index idx_consent_records_user_id on consent_records(user_id);
create index idx_profiles_deleted_at on profiles(deleted_at) where deleted_at is not null;
create index idx_profiles_stripe_customer_id on profiles(stripe_customer_id) where stripe_customer_id is not null;

-- =============================================================
-- Updated_at trigger
-- =============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- =============================================================
-- Row Level Security (RLS)
-- Default: DENY all. Explicit ALLOW per table.
-- =============================================================

alter table profiles enable row level security;
alter table readings enable row level security;
alter table sessions enable row level security;
alter table session_messages enable row level security;
alter table daily_horoscopes enable row level security;
alter table consent_records enable row level security;

-- profiles: users can only access their own (non-deleted) profile
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id and deleted_at is null);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id and deleted_at is null);

-- readings: users can only access their own readings
create policy "readings_select_own" on readings
  for select using (auth.uid() = user_id);

create policy "readings_insert_own" on readings
  for insert with check (auth.uid() = user_id);

-- sessions: users can only access their own sessions
create policy "sessions_select_own" on sessions
  for select using (auth.uid() = user_id);

create policy "sessions_insert_own" on sessions
  for insert with check (auth.uid() = user_id);

create policy "sessions_update_own" on sessions
  for update using (auth.uid() = user_id);

-- session_messages: access through session ownership
create policy "session_messages_select_own" on session_messages
  for select using (
    session_id in (select id from sessions where user_id = auth.uid())
  );

create policy "session_messages_insert_own" on session_messages
  for insert with check (
    session_id in (select id from sessions where user_id = auth.uid())
  );

-- daily_horoscopes: all authenticated users can read
create policy "daily_horoscopes_select_auth" on daily_horoscopes
  for select using (auth.role() = 'authenticated');

-- consent_records: users can read their own, insert their own
create policy "consent_records_select_own" on consent_records
  for select using (auth.uid() = user_id);

create policy "consent_records_insert_own" on consent_records
  for insert with check (auth.uid() = user_id);
