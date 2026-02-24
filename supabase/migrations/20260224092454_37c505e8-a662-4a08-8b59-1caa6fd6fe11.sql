
-- Create status enum
CREATE TYPE public.truck_status AS ENUM ('ממתין_לבדיקה', 'בבדיקה', 'מאושר', 'נדחה');

-- Food trucks main table
CREATE TABLE public.food_trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  operator_name TEXT NOT NULL,
  operator_id TEXT,
  vehicle_type TEXT,
  vehicle_description TEXT,
  cuisine TEXT,
  operating_hours TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  street_address TEXT,
  neighborhood TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status truck_status NOT NULL DEFAULT 'ממתין_לבדיקה',
  logo_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Truck photos
CREATE TABLE public.truck_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('building', 'area', 'truck')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Compliance checklist
CREATE TABLE public.compliance_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE CASCADE NOT NULL,
  item_key TEXT NOT NULL,
  item_label TEXT NOT NULL,
  passed BOOLEAN DEFAULT false,
  UNIQUE(truck_id, item_key)
);

-- Applications (public submissions)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  applicant_id TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_email TEXT,
  vehicle_type TEXT,
  vehicle_dimensions TEXT,
  food_category TEXT,
  operating_hours TEXT,
  requested_street TEXT,
  requested_neighborhood TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status truck_status NOT NULL DEFAULT 'ממתין_לבדיקה',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE SET NULL
);

-- Admin notes log
CREATE TABLE public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Status history for timeline
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES public.food_trucks(id) ON DELETE CASCADE NOT NULL,
  old_status truck_status,
  new_status truck_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Application files
CREATE TABLE public.application_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.food_trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_files ENABLE ROW LEVEL SECURITY;

-- Create admin role check function
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- PUBLIC READ policies for food_trucks, truck_photos, compliance_checklist
CREATE POLICY "Anyone can view food trucks" ON public.food_trucks FOR SELECT USING (true);
CREATE POLICY "Anyone can view truck photos" ON public.truck_photos FOR SELECT USING (true);
CREATE POLICY "Anyone can view compliance checklist" ON public.compliance_checklist FOR SELECT USING (true);
CREATE POLICY "Anyone can view status history" ON public.status_history FOR SELECT USING (true);

-- Public can insert applications
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Anyone can upload application files" ON public.application_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view application files" ON public.application_files FOR SELECT USING (true);

-- Admin full access policies
CREATE POLICY "Admins can manage food trucks" ON public.food_trucks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage truck photos" ON public.truck_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage compliance" ON public.compliance_checklist FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage applications" ON public.applications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage notes" ON public.admin_notes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view notes" ON public.admin_notes FOR SELECT USING (true);
CREATE POLICY "Admins can manage status history" ON public.status_history FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage application files" ON public.application_files FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_food_trucks_updated_at
  BEFORE UPDATE ON public.food_trucks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for food_trucks
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_trucks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
