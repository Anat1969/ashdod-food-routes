
-- Drop the overly permissive UPDATE policy
DROP POLICY "Anyone can update application truck_id" ON public.applications;

-- Create a secure function to handle application submission atomically
CREATE OR REPLACE FUNCTION public.submit_application(
  p_applicant_name text,
  p_applicant_id text,
  p_applicant_phone text,
  p_applicant_email text DEFAULT NULL,
  p_vehicle_type text DEFAULT NULL,
  p_vehicle_dimensions text DEFAULT NULL,
  p_food_category text DEFAULT NULL,
  p_operating_hours text DEFAULT NULL,
  p_requested_street text DEFAULT NULL,
  p_requested_neighborhood text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_truck_id uuid;
  v_app_id uuid;
BEGIN
  -- Create food truck record
  INSERT INTO public.food_trucks (
    name, operator_name, operator_id, contact_phone, contact_email,
    vehicle_type, cuisine, operating_hours, street_address, neighborhood,
    status
  ) VALUES (
    p_applicant_name, p_applicant_name, p_applicant_id, p_applicant_phone, p_applicant_email,
    p_vehicle_type, p_food_category, p_operating_hours, p_requested_street, p_requested_neighborhood,
    'ממתין_לבדיקה'
  ) RETURNING id INTO v_truck_id;

  -- Create application record linked to the truck
  INSERT INTO public.applications (
    applicant_name, applicant_id, applicant_phone, applicant_email,
    vehicle_type, vehicle_dimensions, food_category, operating_hours,
    requested_street, requested_neighborhood, truck_id
  ) VALUES (
    p_applicant_name, p_applicant_id, p_applicant_phone, p_applicant_email,
    p_vehicle_type, p_vehicle_dimensions, p_food_category, p_operating_hours,
    p_requested_street, p_requested_neighborhood, v_truck_id
  ) RETURNING id INTO v_app_id;

  RETURN v_app_id;
END;
$$;

-- Also drop the INSERT policy on food_trucks since the function is SECURITY DEFINER
DROP POLICY "Anyone can submit food trucks via application" ON public.food_trucks;
