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

export const DESIGN_ITEMS = [
  {
    key: 'mobility',
    label: '1. ניידות',
    description: 'חובה על המבנה להיות נייד באופן מלא על גלגלים, ללא עיגון קבוע לקרקע וללא יסודות.',
  },
  {
    key: 'materials_color',
    label: '2. חומריות וצבע',
    description: 'עיצוב מינימליסטי. שימוש בפלטה מוגבלת של עד שני גוונים ועד שני חומרים עיקריים בלבד.',
  },
  {
    key: 'finish_quality',
    label: '3. גימור',
    description: 'חיפוי בצבע אפוי בתנור (Finish איכותי). חל איסור מוחלט על שימוש במדבקות מיתוג זולות על גבי המבנה.',
  },
  {
    key: 'systems_hidden',
    label: '4. מערכות',
    description: 'a. מיזוג: מוסתר ומשולב בתוך המבנה (לא מנוע חיצוני תלוי).\nb. אחסון: פנימי בלבד. אין להציב מחסנים, ארגזים או ציוד היקפי מחוץ למבנה.',
  },
  {
    key: 'integral_furniture',
    label: '5. ריהוט אינטגרלי',
    description: 'העדפה לריהוט המובנה, הקבוע כחלק אינטגרלי מהסביבה.\n(דלפק-בר וכיסאות השייכים לסביבה הנופית – בטיילת, לדוגמא).',
  },
  {
    key: 'signage',
    label: '6. שילוט',
    description: 'הלוגו והשילוט יהיו משולבים בגוף המבנה (חזית וצד) בצורה מוצנעת ושטוחה, לא בולטת מהמבנה.\nאין להציב שלטים על הגג.',
  },
];

export const STRUCTURE_ENV_ITEMS = [
  {
    key: 'physical_location',
    label: 'מיקום פיזי',
    description: 'ההצבה תעשה אך ורק על משטח ריצוף קיים.\nאסור להציב על משטח טבעי (חול, אדמה, צמחייה) ואסור לבצע עבודות קרקע.',
  },
  {
    key: 'infrastructure',
    label: 'תשתיות',
    description: 'התחברות לנקודות קיימות ומסומנות בלבד (מים, חשמל, ביוב).\nאין להעביר כבלים או צינורות חשופים במרחב הציבורי.',
  },
  {
    key: 'lighting',
    label: 'תאורה',
    description: 'תאורה אינטגרלית מתוך המבנה בלבד.\nאין להציב גופי תאורה חיצוניים או עמודי תאורה פרוביזוריים.',
  },
  {
    key: 'view_preservation',
    label: 'שימור מבטים',
    description: 'העמדה לא תסתיר את הנוף הטבעי (ים, נחל) ולא תמוקם על ציר הליכה ראשי או שער כניסה.',
  },
];

export const COMPLIANCE_ITEMS = [
  ...DESIGN_ITEMS,
  ...STRUCTURE_ENV_ITEMS,
];

export type ZoneRule = {
  category: string;
  allowed: boolean;
  note?: string;
};

export type ZoneProfile = {
  name: string;
  description: string;
  rules: ZoneRule[];
};

export const ZONE_PROFILES: ZoneProfile[] = [
  {
    name: 'רצועת חוף אקספנסיבית',
    description: 'אזור טיילת ים רחב עם נוף פתוח',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: false, note: 'עדיפות לריהוט אינטגרלי מובנה בסביבה' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'חסימת קו ראייה לים', allowed: false },
    ],
  },
  {
    name: 'מרינה',
    description: 'אזור הנמל והמרינה',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: true, note: 'בכפוף לאישור' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'חסימת קו ראייה לים', allowed: false },
    ],
  },
  {
    name: 'חוף אינטנסיבי',
    description: 'אזור חוף רחצה מוכרז עם תשתיות קיימות',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: false, note: 'ריהוט אינטגרלי בלבד' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי (חול)', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'חסימת קו ראייה לים', allowed: false },
    ],
  },
  {
    name: 'פארקים',
    description: 'שטחים ירוקים ופארקים עירוניים',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: false, note: 'ריהוט אינטגרלי בלבד' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי (דשא/אדמה)', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'פגיעה בצמחייה קיימת', allowed: false },
    ],
  },
  {
    name: 'נחל לכיש',
    description: 'רצועת נחל לכיש והטיילת לאורכו',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: false, note: 'ריהוט אינטגרלי בלבד' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'חסימת קו ראייה לנחל', allowed: false },
    ],
  },
  {
    name: 'המצודה',
    description: 'אזור מצודת אשדוד-ים ההיסטורית',
    rules: [
      { category: 'עמדת מזון ניידת (פודטראק)', allowed: true },
      { category: 'דלפק-בר אינטגרלי', allowed: true },
      { category: 'ריהוט חיצוני קבוע', allowed: false, note: 'ריהוט אינטגרלי בלבד' },
      { category: 'שלטים בולטים / על הגג', allowed: false },
      { category: 'מחסנים / ציוד חיצוני', allowed: false },
      { category: 'הצבה על משטח טבעי', allowed: false },
      { category: 'תאורה חיצונית עצמאית', allowed: false },
      { category: 'פגיעה באתר עתיקות', allowed: false },
    ],
  },
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
