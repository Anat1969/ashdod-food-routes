
-- Rename compliance_checklist columns to match current content
ALTER TABLE public.compliance_checklist RENAME COLUMN professional_design TO mobility;
ALTER TABLE public.compliance_checklist RENAME COLUMN signage_approved TO materials_color;
-- finish_quality stays as-is
-- systems_hidden stays as-is
ALTER TABLE public.compliance_checklist RENAME COLUMN fire_suppression_ok TO integral_furniture;
ALTER TABLE public.compliance_checklist RENAME COLUMN no_alcohol_tobacco TO signage;
ALTER TABLE public.compliance_checklist RENAME COLUMN wheelchair_space_ok TO physical_location;
ALTER TABLE public.compliance_checklist RENAME COLUMN edge_kitchen_only TO infrastructure;
ALTER TABLE public.compliance_checklist RENAME COLUMN counter_height_ok TO lighting;
ALTER TABLE public.compliance_checklist RENAME COLUMN access_path_90cm TO view_preservation;
