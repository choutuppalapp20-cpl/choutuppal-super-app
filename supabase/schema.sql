-- Create users table
CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  phone_number text unique,
  subscription_tier text default 'basic',
  preferred_language text default 'english'
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
-- Allow public viewing of basic profiles for listings
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);

-- Create listings table
CREATE TABLE public.listings (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  category text not null,
  image_urls text[],
  is_promoted boolean default false
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own listings" ON public.listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own listings" ON public.listings FOR DELETE USING (auth.uid() = owner_id);

-- Create real_estate_listings table
CREATE TABLE public.real_estate_listings (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  property_type text,
  price numeric,
  image_urls text[]
);

ALTER TABLE public.real_estate_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Real estate listings are viewable by everyone" ON public.real_estate_listings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own real estate listings" ON public.real_estate_listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own real estate listings" ON public.real_estate_listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own real estate listings" ON public.real_estate_listings FOR DELETE USING (auth.uid() = owner_id);

-- Create real_estate_leads table
CREATE TABLE public.real_estate_leads (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.real_estate_listings(id) not null,
  lead_user_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending'
);

ALTER TABLE public.real_estate_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own leads" ON public.real_estate_leads FOR INSERT WITH CHECK (auth.uid() = lead_user_id);
CREATE POLICY "Listing owners can view leads for their listings" ON public.real_estate_leads FOR SELECT USING (
  exists (select 1 from public.real_estate_listings where id = real_estate_leads.listing_id and owner_id = auth.uid())
);

-- Create stories table
CREATE TABLE public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '24 hours') not null,
  media_url text not null,
  media_type text not null
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE USING (auth.uid() = user_id);

-- Create global_settings table for Admin Toggle
CREATE TABLE public.global_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Global settings viewable by everyone" ON public.global_settings FOR SELECT USING (true);
-- In a real app this would be restricted to admin role, but simplifying for PRD
CREATE POLICY "Settings updatable by authenticated users" ON public.global_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Settings insertable by authenticated users" ON public.global_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed initial setting
INSERT INTO public.global_settings (key, value) VALUES ('free_stories_enabled', 'true') ON CONFLICT (key) DO NOTHING;

-- Create affiliate_keywords table
CREATE TABLE public.affiliate_keywords (
  id uuid default gen_random_uuid() primary key,
  keyword text not null unique,
  affiliate_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.affiliate_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliate keywords viewable by everyone" ON public.affiliate_keywords FOR SELECT USING (true);
CREATE POLICY "Affiliate keywords manageability by auth users" ON public.affiliate_keywords FOR ALL USING (auth.role() = 'authenticated');

