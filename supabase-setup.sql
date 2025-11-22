-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create groups table (if it doesn't exist)
create table if not exists groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  constituency text not null,
  contact_person text not null,
  phone_number text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create buyer profiles table
create table if not exists buyer_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  business_name text not null,
  business_type text not null check (business_type in ('recycler', 'manufacturer', 'retailer', 'other')),
  contact_person text not null,
  phone_number text not null,
  email text not null,
  address text not null,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'basic', 'premium')),
  is_verified boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint unique_email unique (email)
);

-- Create waste listings table
create table if not exists waste_listings (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid not null references groups(id) on delete cascade,
  waste_type text not null check (waste_type in ('plastic', 'paper', 'metal', 'glass', 'organic', 'other')),
  quantity numeric not null check (quantity > 0),
  price_per_kg numeric not null check (price_per_kg >= 0),
  available_from timestamptz not null,
  available_until timestamptz not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'expired')),
  location text not null,
  description text,
  images text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create transactions table
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid not null references waste_listings(id) on delete cascade,
  buyer_id uuid not null references buyer_profiles(id) on delete cascade,
  seller_id uuid not null references groups(id) on delete cascade,
  quantity numeric not null check (quantity > 0),
  price_per_kg numeric not null check (price_per_kg >= 0),
  total_amount numeric not null check (total_amount >= 0),
  commission_rate numeric not null check (commission_rate >= 0 and commission_rate <= 100),
  commission_amount numeric not null check (commission_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled', 'disputed')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  transaction_date timestamptz default now() not null,
  completed_date timestamptz,
  notes text,
  created_at timestamptz default now() not null
);

-- Create a function to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create triggers to update updated_at
drop trigger if exists update_groups_updated_at on groups;
create trigger update_groups_updated_at
before update on groups
for each row execute function update_updated_at_column();

drop trigger if exists update_buyer_profiles_updated_at on buyer_profiles;
create trigger update_buyer_profiles_updated_at
before update on buyer_profiles
for each row execute function update_updated_at_column();

drop trigger if exists update_waste_listings_updated_at on waste_listings;
create trigger update_waste_listings_updated_at
before update on waste_listings
for each row execute function update_updated_at_column();

-- Set up Row Level Security (RLS)
alter table groups enable row level security;
alter table buyer_profiles enable row level security;
alter table waste_listings enable row level security;
alter table transactions enable row level security;

-- Create RLS policies
create policy "Users can view their own groups"
  on groups for select
  using (auth.uid() = id);

create policy "Users can manage their own groups"
  on groups for all
  using (auth.uid() = id);

create policy "Buyers can view their own profile"
  on buyer_profiles for select
  using (auth.uid() = id);

create policy "Buyers can update their own profile"
  on buyer_profiles for update
  using (auth.uid() = id);

create policy "Public listings are viewable by everyone"
  on waste_listings for select
  using (true);

create policy "Sellers can manage their listings"
  on waste_listings for all
  using (auth.uid() = group_id);

create policy "Buyers can view their transactions"
  on transactions for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create transactions"
  on transactions for insert
  with check (auth.uid() = buyer_id);

-- Insert some sample data for testing
insert into groups (name, constituency, contact_person, phone_number) values
('Kibera Clean Team', 'Kibra', 'John Doe', '+254 712 345 678'),
('Westlands Recyclers', 'Westlands', 'Jane Smith', '+254 723 456 789')
on conflict do nothing;
