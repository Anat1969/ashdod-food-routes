-- Add existing_building_approval field to locations
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS existing_building_approval BOOLEAN DEFAULT NULL;
