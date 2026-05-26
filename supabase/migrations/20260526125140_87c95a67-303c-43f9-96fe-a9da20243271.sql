
DROP POLICY IF EXISTS "Operators can insert own trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Operators can update own trucks" ON public.food_trucks;

CREATE POLICY "Operators can insert own trucks"
ON public.food_trucks
FOR INSERT
WITH CHECK (
  operator_id = auth.uid()
  AND status IN ('draft', 'submitted')
);

CREATE POLICY "Operators can update own trucks"
ON public.food_trucks
FOR UPDATE
USING (operator_id = auth.uid())
WITH CHECK (
  operator_id = auth.uid()
  AND status IN ('draft', 'submitted', 'requires_changes')
);
