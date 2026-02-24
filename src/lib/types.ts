export type TruckStatus = 'ממתין_לבדיקה' | 'בבדיקה' | 'מאושר' | 'נדחה';

export const STATUS_LABELS: Record<TruckStatus, string> = {
  'ממתין_לבדיקה': 'ממתין לבדיקה',
  'בבדיקה': 'בבדיקה',
  'מאושר': 'מאושר',
  'נדחה': 'נדחה',
};

export const STATUS_VARIANTS: Record<TruckStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'ממתין_לבדיקה': 'outline',
  'בבדיקה': 'secondary',
  'מאושר': 'default',
  'נדחה': 'destructive',
};

export interface FoodTruck {
  id: string;
  name: string;
  operator_name: string;
  operator_id: string | null;
  vehicle_type: string | null;
  vehicle_description: string | null;
  cuisine: string | null;
  operating_hours: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  street_address: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  status: TruckStatus;
  logo_url: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_name: string;
  applicant_id: string;
  applicant_phone: string;
  applicant_email: string | null;
  vehicle_type: string | null;
  vehicle_dimensions: string | null;
  food_category: string | null;
  operating_hours: string | null;
  requested_street: string | null;
  requested_neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
  status: TruckStatus;
  submitted_at: string;
  truck_id: string | null;
}

export interface ComplianceItem {
  id: string;
  truck_id: string;
  item_key: string;
  item_label: string;
  passed: boolean;
}

export interface StatusHistoryEntry {
  id: string;
  truck_id: string;
  old_status: TruckStatus | null;
  new_status: TruckStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface AdminNote {
  id: string;
  truck_id: string;
  note: string;
  admin_user_id: string | null;
  created_at: string;
}

export const COMPLIANCE_ITEMS = [
  { key: 'professional_design', label: 'עיצוב מקצועי' },
  { key: 'appearance_approval', label: 'אישור חזות ושילוט' },
  { key: 'curb_distance', label: 'מרחק 60 ס"מ מקו אבן השפה' },
  { key: 'no_furniture_blocking', label: 'אי חסימת רהוט רחוב' },
  { key: 'counter_height', label: 'גובה דלפק מקס\' 110 ס"מ' },
  { key: 'access_width', label: 'רוחב נתיב גישה 90 ס"מ' },
  { key: 'edge_kitchen_only', label: 'מטבח קצה בלבד' },
  { key: 'fire_system', label: 'מערכת כיבוי אש' },
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
