ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS existing_building_approval boolean DEFAULT NULL;
