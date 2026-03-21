
CREATE TABLE public.experience_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text,
  text_content text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view posts
CREATE POLICY "Anyone can view experience posts"
  ON public.experience_posts FOR SELECT
  USING (true);

-- Authenticated users can insert their own posts
CREATE POLICY "Authenticated can insert own experience posts"
  ON public.experience_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own posts
CREATE POLICY "Users can update own experience posts"
  ON public.experience_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "Users can delete own experience posts"
  ON public.experience_posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Privileged can manage all
CREATE POLICY "Privileged can manage all experience posts"
  ON public.experience_posts FOR ALL
  USING (is_privileged(auth.uid()))
  WITH CHECK (is_privileged(auth.uid()));
