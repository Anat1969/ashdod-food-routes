
ALTER TABLE public.compliance_checklist
ADD COLUMN finish_quality boolean DEFAULT null,
ADD COLUMN systems_hidden boolean DEFAULT null;
