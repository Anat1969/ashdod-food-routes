-- Fix food_trucks RLS: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Public can view approved trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Operators can view own trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Operators can insert own trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Operators can update own trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Privileged can manage all trucks" ON public.food_trucks;

CREATE POLICY "Public can view approved trucks" ON public.food_trucks FOR SELECT USING (status = 'approved');
CREATE POLICY "Operators can view own trucks" ON public.food_trucks FOR SELECT USING (operator_id = auth.uid());
CREATE POLICY "Operators can insert own trucks" ON public.food_trucks FOR INSERT WITH CHECK (operator_id = auth.uid());
CREATE POLICY "Operators can update own trucks" ON public.food_trucks FOR UPDATE USING (operator_id = auth.uid());
CREATE POLICY "Privileged can manage all trucks" ON public.food_trucks FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));

-- Fix activity_log RLS
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Privileged can manage all activity" ON public.activity_log;
DROP POLICY IF EXISTS "Authenticated can insert own activity" ON public.activity_log;

CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Privileged can manage all activity" ON public.activity_log FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));
CREATE POLICY "Authenticated can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix compliance_checklist RLS
DROP POLICY IF EXISTS "Operators can view own checklist" ON public.compliance_checklist;
DROP POLICY IF EXISTS "Privileged can manage checklists" ON public.compliance_checklist;

CREATE POLICY "Operators can view own checklist" ON public.compliance_checklist FOR SELECT USING (EXISTS (SELECT 1 FROM food_trucks WHERE food_trucks.id = compliance_checklist.truck_id AND food_trucks.operator_id = auth.uid()));
CREATE POLICY "Privileged can manage checklists" ON public.compliance_checklist FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));

-- Fix expert_opinions RLS
DROP POLICY IF EXISTS "Operators can view own opinions" ON public.expert_opinions;
DROP POLICY IF EXISTS "Privileged can manage opinions" ON public.expert_opinions;

CREATE POLICY "Operators can view own opinions" ON public.expert_opinions FOR SELECT USING (EXISTS (SELECT 1 FROM food_trucks WHERE food_trucks.id = expert_opinions.truck_id AND food_trucks.operator_id = auth.uid()));
CREATE POLICY "Privileged can manage opinions" ON public.expert_opinions FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));

-- Fix profiles RLS
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix locations RLS
DROP POLICY IF EXISTS "Anyone can view locations" ON public.locations;
DROP POLICY IF EXISTS "Privileged can manage locations" ON public.locations;

CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Privileged can manage locations" ON public.locations FOR ALL USING (is_privileged(auth.uid())) WITH CHECK (is_privileged(auth.uid()));

-- Fix user_roles RLS
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());