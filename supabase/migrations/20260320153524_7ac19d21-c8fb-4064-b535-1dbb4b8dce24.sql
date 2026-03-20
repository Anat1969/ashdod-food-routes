ALTER TABLE public.food_trucks 
  ADD COLUMN IF NOT EXISTS environment_ok boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS truck_condition_ok boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS has_operator boolean DEFAULT false;