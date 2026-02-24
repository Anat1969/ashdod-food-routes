-- Drop old check constraints
ALTER TABLE public.locations DROP CONSTRAINT IF EXISTS locations_location_type_check;
ALTER TABLE public.food_trucks DROP CONSTRAINT IF EXISTS food_trucks_vehicle_type_check;

-- Add updated check constraint for location_type with Hebrew station types
ALTER TABLE public.locations ADD CONSTRAINT locations_location_type_check
  CHECK (location_type = ANY (ARRAY[
    'historic','tourism','commercial','nature','park',
    'חוף אקספנסיבי','מרינה','חוף אינטנסיבי','נחל לכיש','פארקים'
  ]));

-- Allow vehicle_type to be any text (used as boolean flag for food truck presence)
-- No constraint needed since we use 'פודטראק' or null