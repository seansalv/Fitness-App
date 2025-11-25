-- Hero Arc base schema
create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  handle text not null unique,
  goal text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create type public.rank_tier as enum ('E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS');

create table if not exists public.user_stats (
  user_id uuid primary key references public.users (id) on delete cascade,
  level int not null default 1,
  rank rank_tier not null default 'E',
  total_xp int not null default 0,
  streak_days int not null default 0,
  last_activity_date date
);

create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null,
  intensity text not null,
  duration_minutes int not null,
  xp_awarded int not null,
  timestamp timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workouts_user_id_idx on public.workouts (user_id, timestamp desc);

