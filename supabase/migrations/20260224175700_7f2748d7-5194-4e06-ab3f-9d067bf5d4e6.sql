
ALTER TABLE public.expert_opinions
  ADD COLUMN environment_ok boolean,
  ADD COLUMN structure_ok boolean,
  ADD COLUMN field_notes text;
