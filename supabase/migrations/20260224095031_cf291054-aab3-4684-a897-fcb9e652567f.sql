
-- Allow public users to insert food trucks with pending status only
CREATE POLICY "Anyone can submit food trucks via application"
ON public.food_trucks FOR INSERT
WITH CHECK (status = 'ממתין_לבדיקה');

-- Allow public users to update their application's truck_id
CREATE POLICY "Anyone can update application truck_id"
ON public.applications FOR UPDATE
USING (true)
WITH CHECK (true);
