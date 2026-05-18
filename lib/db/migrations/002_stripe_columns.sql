-- Migration: Add Stripe subscription columns to profiles
-- Apply via Supabase Dashboard SQL Editor

alter table profiles add column if not exists stripe_customer_id text unique;
alter table profiles add column if not exists stripe_subscription_id text unique;
alter table profiles add column if not exists subscription_status text not null default 'none';
alter table profiles add column if not exists subscription_period_end timestamptz;

-- Index for webhook lookups by stripe_customer_id
create index if not exists idx_profiles_stripe_customer_id
  on profiles(stripe_customer_id) where stripe_customer_id is not null;
