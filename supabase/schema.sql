-- supabase/schema.sql

-- 1. Create a table to store user profile data
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_tier text default 'free', -- 'free', 'pro', 'business'
  words_used_this_month integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create policies (Who can see what?)
-- Users can read their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

-- Users can update their own profile (optional, mostly for the backend to update)
create policy "Users can update own profile" 
  on public.profiles for update 
  using ( auth.uid() = id );

-- 4. Create a function to handle new user signups
-- This automatically creates a row in 'public.profiles' whenever a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();