-- Migration: Add Banners table and status tracking for listings

-- 1. Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_url text NOT NULL,
    link_url text,
    is_active boolean DEFAULT true,
    position integer DEFAULT 0,
    title text
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banners are viewable by everyone" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Banners manageability by auth users" ON public.banners FOR ALL USING (auth.role() = 'authenticated');

-- 2. Add status column to listings
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='status') THEN
        ALTER TABLE public.listings ADD COLUMN status text DEFAULT 'pending';
    END IF;
END $$;

-- 3. Add status column to real_estate_listings
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='real_estate_listings' AND column_name='status') THEN
        ALTER TABLE public.real_estate_listings ADD COLUMN status text DEFAULT 'pending';
    END IF;
END $$;
