import type { Tables } from "@/integrations/supabase/types";

export type FoodTruck = Tables<"food_trucks">;
export type ComplianceChecklist = Tables<"compliance_checklist">;
export type ExpertOpinion = Tables<"expert_opinions">;
export type ActivityLog = Tables<"activity_log">;
export type Location = Tables<"locations">;
export type Profile = Tables<"profiles">;

export type TruckStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export const STATUS_LABELS: Record<TruckStatus, string> = {
  draft: 'טיוטה',
  submitted: 'הוגש',
  under_review: 'בבדיקה',
  approved: 'מאושר',
  rejected: 'נדחה',
};

export const STATUS_VARIANTS: Record<TruckStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  submitted: 'secondary',
  under_review: 'secondary',
  approved: 'default',
  rejected: 'destructive',
};

export const COMPLIANCE_ITEMS = [
  { key: 'professional_design', label: 'עיצוב מקצועי' },
  { key: 'signage_approved', label: 'אישור חזות ושילוט' },
  { key: 'counter_height_ok', label: 'גובה דלפק מקס\' 110 ס"מ' },
  { key: 'access_path_90cm', label: 'רוחב נתיב גישה 90 ס"מ' },
  { key: 'wheelchair_space_ok', label: 'מרחב נגיש לכיסא גלגלים' },
  { key: 'edge_kitchen_only', label: 'מטבח קצה בלבד' },
  { key: 'fire_suppression_ok', label: 'מערכת כיבוי אש' },
  { key: 'no_alcohol_tobacco', label: 'ללא אלכוהול וטבק' },
];

export const NEIGHBORHOODS = [
  'רובע א\'',
  'רובע ב\'',
  'רובע ג\'',
  'רובע ד\'',
  'רובע ה\'',
  'רובע ו\'',
  'רובע ז\'',
  'רובע ח\'',
  'רובע ט\'',
  'רובע י\'',
  'רובע י"א',
  'רובע י"ב',
  'רובע י"ג',
  'רובע י"ד',
  'רובע ט"ו',
  'רובע ט"ז',
  'רובע י"ז',
  'מרינה',
  'תעשייה צפונית',
  'עד הלום',
];
