
-- 1. food_trucks: hide operator personal info from anon
REVOKE SELECT (operator_email, operator_address, operator_name, operator_id)
  ON public.food_trucks FROM anon;

-- 2. profiles: prevent role self-escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- 3. Storage: avatars - scope by user id folder
DROP POLICY IF EXISTS "Authenticated can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update avatars" ON storage.objects;

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Storage: documents - scope by truck ownership
DROP POLICY IF EXISTS "Authenticated can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update documents" ON storage.objects;

CREATE POLICY "Truck owners and privileged can view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Truck owners and privileged can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Truck owners and privileged can update documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documents'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Truck owners and privileged can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

-- 5. Storage: truck-photos - scope upload/update/delete by truck ownership
DROP POLICY IF EXISTS "Authenticated can upload truck photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete truck photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update truck photos" ON storage.objects;

CREATE POLICY "Truck owners and privileged can upload truck photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'truck-photos'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Truck owners and privileged can update truck photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'truck-photos'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

CREATE POLICY "Truck owners and privileged can delete truck photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'truck-photos'
    AND (
      public.is_privileged(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.food_trucks ft
        WHERE ft.id::text = (storage.foldername(name))[1]
          AND ft.operator_id = auth.uid()
      )
    )
  );

-- 6. Revoke EXECUTE on internal SECURITY DEFINER trigger helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
