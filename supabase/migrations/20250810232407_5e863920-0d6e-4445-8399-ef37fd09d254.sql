-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- Timestamp update helper
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Chart preferences per user
create table if not exists public.chart_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  symbol text not null,
  timeframe text not null,
  chart_type text not null,
  live boolean not null default false,
  overlays text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists chart_preferences_user_unique on public.chart_preferences(user_id);

-- Signals table
create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  rule text not null,
  symbol text not null,
  tf text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trades table
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  symbol text not null,
  side text not null,
  qty numeric not null,
  price numeric not null,
  ts timestamptz not null default now(),
  pl numeric,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- Positions table
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  symbol text not null,
  qty numeric not null,
  avg_price numeric not null,
  status text not null default 'open',
  opened_at timestamptz default now(),
  closed_at timestamptz,
  pl_closed numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Portfolio snapshots
create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  value numeric not null,
  delta_abs numeric,
  delta_pct numeric,
  as_of timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Analysis logs
create table if not exists public.analysis_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  symbol text,
  note text,
  level text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.chart_preferences enable row level security;
alter table public.signals enable row level security;
alter table public.trades enable row level security;
alter table public.positions enable row level security;
alter table public.portfolio_snapshots enable row level security;
alter table public.analysis_logs enable row level security;

-- Policies: authenticated users can manage their own rows
create policy if not exists "Select own chart_preferences" on public.chart_preferences for select using (auth.uid() = user_id);
create policy if not exists "Insert own chart_preferences" on public.chart_preferences for insert with check (auth.uid() = user_id);
create policy if not exists "Update own chart_preferences" on public.chart_preferences for update using (auth.uid() = user_id);
create policy if not exists "Delete own chart_preferences" on public.chart_preferences for delete using (auth.uid() = user_id);

create policy if not exists "Select own signals" on public.signals for select using (auth.uid() = user_id);
create policy if not exists "Insert own signals" on public.signals for insert with check (auth.uid() = user_id);
create policy if not exists "Update own signals" on public.signals for update using (auth.uid() = user_id);
create policy if not exists "Delete own signals" on public.signals for delete using (auth.uid() = user_id);

create policy if not exists "Select own trades" on public.trades for select using (auth.uid() = user_id);
create policy if not exists "Insert own trades" on public.trades for insert with check (auth.uid() = user_id);
create policy if not exists "Update own trades" on public.trades for update using (auth.uid() = user_id);
create policy if not exists "Delete own trades" on public.trades for delete using (auth.uid() = user_id);

create policy if not exists "Select own positions" on public.positions for select using (auth.uid() = user_id);
create policy if not exists "Insert own positions" on public.positions for insert with check (auth.uid() = user_id);
create policy if not exists "Update own positions" on public.positions for update using (auth.uid() = user_id);
create policy if not exists "Delete own positions" on public.positions for delete using (auth.uid() = user_id);

create policy if not exists "Select own portfolio_snapshots" on public.portfolio_snapshots for select using (auth.uid() = user_id);
create policy if not exists "Insert own portfolio_snapshots" on public.portfolio_snapshots for insert with check (auth.uid() = user_id);
create policy if not exists "Update own portfolio_snapshots" on public.portfolio_snapshots for update using (auth.uid() = user_id);
create policy if not exists "Delete own portfolio_snapshots" on public.portfolio_snapshots for delete using (auth.uid() = user_id);

-- Analysis logs: allow users to manage their own rows; no anonymous writes
create policy if not exists "Select own analysis_logs" on public.analysis_logs for select using (auth.uid() = user_id);
create policy if not exists "Insert own analysis_logs" on public.analysis_logs for insert with check (auth.uid() = user_id);
create policy if not exists "Update own analysis_logs" on public.analysis_logs for update using (auth.uid() = user_id);
create policy if not exists "Delete own analysis_logs" on public.analysis_logs for delete using (auth.uid() = user_id);

-- Triggers to maintain updated_at
create trigger if not exists trg_chart_prefs_updated_at
before update on public.chart_preferences
for each row execute function public.update_updated_at_column();

create trigger if not exists trg_signals_updated_at
before update on public.signals
for each row execute function public.update_updated_at_column();

create trigger if not exists trg_positions_updated_at
before update on public.positions
for each row execute function public.update_updated_at_column();

-- Realtime publication
alter publication supabase_realtime add table public.signals;
alter publication supabase_realtime add table public.trades;
alter publication supabase_realtime add table public.positions;
alter publication supabase_realtime add table public.portfolio_snapshots;
alter publication supabase_realtime add table public.analysis_logs;
alter publication supabase_realtime add table public.chart_preferences;