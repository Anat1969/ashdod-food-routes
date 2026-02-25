
CREATE TABLE public.zone_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name text NOT NULL UNIQUE,
  image_url text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.zone_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view zone images" ON public.zone_images FOR SELECT USING (true);
CREATE POLICY "Privileged can manage zone images" ON public.zone_images FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));
