
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view menu items (public advertisement page)
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items FOR SELECT
  USING (true);

-- Privileged users can manage menu items
CREATE POLICY "Privileged can manage menu items"
  ON public.menu_items FOR ALL
  USING (is_privileged(auth.uid()))
  WITH CHECK (is_privileged(auth.uid()));

-- Operators can manage their own truck menu items
CREATE POLICY "Operators can manage own menu items"
  ON public.menu_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.food_trucks
    WHERE food_trucks.id = menu_items.truck_id
    AND food_trucks.operator_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.food_trucks
    WHERE food_trucks.id = menu_items.truck_id
    AND food_trucks.operator_id = auth.uid()
  ));
