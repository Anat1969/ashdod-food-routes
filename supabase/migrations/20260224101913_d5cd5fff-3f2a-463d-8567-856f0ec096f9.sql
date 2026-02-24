
-- Drop existing tables that will be replaced
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS public.admin_notes CASCADE;
DROP TABLE IF EXISTS public.application_files CASCADE;
DROP TABLE IF EXISTS public.status_history CASCADE;
DROP TABLE IF EXISTS public.truck_photos CASCADE;
DROP TABLE IF EXISTS public.compliance_checklist CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.food_trucks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop old enum if exists
DROP TYPE IF EXISTS public.truck_status CASCADE;

-- Drop old function
DROP FUNCTION IF EXISTS public.submit_application CASCADE;

-- ============================================
-- TABLE 1: profiles
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('public', 'operator', 'architect', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE 2: locations
-- ============================================
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  neighborhood TEXT,
  street TEXT,
  gush TEXT,
  chelka TEXT,
  location_type TEXT CHECK (location_type IN ('historic', 'tourism', 'commercial', 'nature', 'park')),
  infra_electricity BOOLEAN NOT NULL DEFAULT false,
  infra_water BOOLEAN NOT NULL DEFAULT false,
  infra_sewage BOOLEAN NOT NULL DEFAULT false,
  building_area_sqm NUMERIC,
  surrounding_area_sqm NUMERIC,
  is_desired BOOLEAN NOT NULL DEFAULT false,
  lat NUMERIC,
  lng NUMERIC
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE 3: food_trucks
-- ============================================
CREATE TABLE public.food_trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES public.profiles(id),
  location_id UUID REFERENCES public.locations(id),
  truck_name TEXT NOT NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('truck', 'caravan', 'stand')),
  food_category TEXT,
  hours_from TIME,
  hours_to TIME,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.food_trucks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE 4: compliance_checklist
-- ============================================
CREATE TABLE public.compliance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  professional_design BOOLEAN,
  signage_approved BOOLEAN,
  counter_height_ok BOOLEAN,
  access_path_90cm BOOLEAN,
  wheelchair_space_ok BOOLEAN,
  edge_kitchen_only BOOLEAN,
  fire_suppression_ok BOOLEAN,
  no_alcohol_tobacco BOOLEAN,
  distance_from_curb_cm NUMERIC,
  notes TEXT,
  checked_by UUID REFERENCES public.profiles(id),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_checklist ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE 5: expert_opinions
-- ============================================
CREATE TABLE public.expert_opinions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id),
  executive_summary TEXT,
  project_description TEXT,
  location_analysis TEXT,
  compliance_summary TEXT,
  conditions TEXT,
  recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'conditional')),
  is_final BOOLEAN NOT NULL DEFAULT false,
  opinion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expert_opinions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE 6: activity_log
-- ============================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT,
  old_status TEXT,
  new_status TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Helper function: check privileged role via profiles
-- (used for non-profiles tables only to avoid recursion)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_privileged(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role IN ('architect', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- profiles (use user_roles to avoid recursion)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- locations
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Privileged can manage locations" ON public.locations FOR ALL USING (public.is_privileged(auth.uid())) WITH CHECK (public.is_privileged(auth.uid()));

-- food_trucks
CREATE POLICY "Public can view approved trucks" ON public.food_trucks FOR SELECT USING (status = 'approved');
CREATE POLICY "Operators can view own trucks" ON public.food_trucks FOR SELECT USING (operator_id = auth.uid());
CREATE POLICY "Operators can insert own trucks" ON public.food_trucks FOR INSERT WITH CHECK (operator_id = auth.uid());
CREATE POLICY "Operators can update own trucks" ON public.food_trucks FOR UPDATE USING (operator_id = auth.uid());
CREATE POLICY "Privileged can manage all trucks" ON public.food_trucks FOR ALL USING (public.is_privileged(auth.uid())) WITH CHECK (public.is_privileged(auth.uid()));

-- compliance_checklist
CREATE POLICY "Operators can view own checklist" ON public.compliance_checklist FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.food_trucks WHERE id = truck_id AND operator_id = auth.uid())
);
CREATE POLICY "Privileged can manage checklists" ON public.compliance_checklist FOR ALL USING (public.is_privileged(auth.uid())) WITH CHECK (public.is_privileged(auth.uid()));

-- expert_opinions
CREATE POLICY "Operators can view own opinions" ON public.expert_opinions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.food_trucks WHERE id = truck_id AND operator_id = auth.uid())
);
CREATE POLICY "Privileged can manage opinions" ON public.expert_opinions FOR ALL USING (public.is_privileged(auth.uid())) WITH CHECK (public.is_privileged(auth.uid()));

-- activity_log
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Privileged can manage all activity" ON public.activity_log FOR ALL USING (public.is_privileged(auth.uid())) WITH CHECK (public.is_privileged(auth.uid()));
CREATE POLICY "Authenticated can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- updated_at trigger for food_trucks
CREATE TRIGGER update_food_trucks_updated_at
  BEFORE UPDATE ON public.food_trucks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
