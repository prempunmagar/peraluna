-- Peraluna Database Schema
-- Run this in Supabase SQL Editor (supabase.com > Your Project > SQL Editor)

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  created_at timestamp with time zone default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TRIPS TABLE
-- ============================================
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  destination text not null,
  country text not null,
  start_date date not null,
  end_date date not null,
  adults int default 1,
  children int default 0,
  budget decimal(10,2),
  budget_type text default 'total' check (budget_type in ('total', 'per-person')),
  flexibility text check (flexibility in ('very-flexible', 'moderately-flexible', 'not-flexible')),
  interests text[] default '{}',
  status text default 'planning' check (status in ('planning', 'booked', 'completed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- PLANNED ITEMS TABLE (tentative selections)
-- ============================================
create table if not exists public.planned_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  type text not null check (type in ('flight', 'hotel', 'activity')),
  provider text,
  title text not null,
  subtitle text,
  details jsonb default '{}',
  price decimal(10,2),
  nights int, -- For hotels: number of nights (null for flights/activities)
  tag text,
  is_confirmed boolean default false,
  booking_reference text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  sender text not null check (sender in ('user', 'luna', 'system')),
  content text not null,
  type text default 'text' check (type in ('text', 'card', 'quick-response')),
  card_data jsonb,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.planned_items enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trips policies
drop policy if exists "Users can view own trips" on public.trips;
create policy "Users can view own trips" on public.trips
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own trips" on public.trips;
create policy "Users can insert own trips" on public.trips
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own trips" on public.trips;
create policy "Users can update own trips" on public.trips
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own trips" on public.trips;
create policy "Users can delete own trips" on public.trips
  for delete using (auth.uid() = user_id);

-- Planned items policies
drop policy if exists "Users can manage own planned items" on public.planned_items;
create policy "Users can manage own planned items" on public.planned_items
  for all using (
    trip_id in (select id from public.trips where user_id = auth.uid())
  );

-- Chat messages policies
drop policy if exists "Users can manage own chat messages" on public.chat_messages;
create policy "Users can manage own chat messages" on public.chat_messages
  for all using (
    trip_id in (select id from public.trips where user_id = auth.uid())
  );

-- ============================================
-- INDEXES for performance
-- ============================================
create index if not exists idx_trips_user_id on public.trips(user_id);
create index if not exists idx_planned_items_trip_id on public.planned_items(trip_id);
create index if not exists idx_chat_messages_trip_id on public.chat_messages(trip_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_trips_updated_at on public.trips;
create trigger update_trips_updated_at
  before update on public.trips
  for each row execute procedure public.update_updated_at_column();
