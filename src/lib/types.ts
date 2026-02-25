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
    key: 'professional_design',
    label: 'עיצוב מקצועי',
    description: 'הפודטראק נדרש להיות אובייקט עיצובי בפני עצמו, נקי וחדשני. חובה על המבנה להיות נייד באופן מלא על גלגלים, ללא עיגון קבוע לקרקע וללא יסודות. עיצוב מינימליסטי, שימוש בפלטה מוגבלת של עד שני גוונים ועד שני חומרים עיקריים בלבד. חיפוי בצבע אפוי בתנור (Finish איכותי). חל איסור מוחלט על שימוש במדבקות מיתוג זולות על גבי המבנה.',
  },
  {
    key: 'signage_approved',
    label: 'אישור חזות ושילוט',
    description: 'הלוגו והשילוט יהיו משולבים בגוף המבנה (חזית וצד) בצורה מוצנעת ושטוחה, לא בולטת מהמבנה. אין להציב שלטים על הגג. ריהוט אינטגרלי – העדפה לריהוט המובנה, הקבוע כחלק אינטגרלי מהסביבה (דלפק-בר וכיסאות השייכים לסביבה הנופית – בטיילת, לדוגמא). מערכות: מיזוג מוסתר ומשולב בתוך המבנה (לא מנוע חיצוני תלוי). אחסון פנימי בלבד, אין להציב מחסנים, ארגזים או ציוד היקפי מחוץ למבנה.',
  },
];

export const STRUCTURE_ENV_ITEMS = [
  {
    key: 'counter_height_ok',
    label: 'גובה דלפק מקס\' 110 ס"מ',
    description: 'גובה הדלפק לא יעלה על 110 ס"מ, על מנת להבטיח נגישות מלאה לכלל המשתמשים כולל אנשים עם מוגבלויות.',
  },
  {
    key: 'access_path_90cm',
    label: 'רוחב נתיב גישה 90 ס"מ',
    description: 'יש להבטיח נתיב גישה ברוחב מינימלי של 90 ס"מ לפחות, ללא חסימות או מכשולים, לצורך מעבר חופשי של כיסאות גלגלים ועגלות.',
  },
  {
    key: 'wheelchair_space_ok',
    label: 'מרחב נגיש לכיסא גלגלים',
    description: 'יש לוודא מרחב תמרון מספיק לכיסא גלגלים בסמוך לדלפק ובאזור הישיבה. ההצבה תעשה אך ורק על משטח ריצוף קיים. אסור להציב על משטח טבעי (חול, אדמה, צמחייה) ואסור לבצע עבודות קרקע.',
  },
  {
    key: 'edge_kitchen_only',
    label: 'מטבח קצה בלבד',
    description: 'הפעילות מוגבלת למטבח קצה בלבד – חימום, הרכבה והגשה. אין לבצע בישול מלא או טיגון במקום. תשתיות: התחברות לנקודות קיימות ומסומנות בלבד (מים, חשמל, ביוב). אין להעביר כבלים או צינורות חשופים במרחב הציבורי.',
  },
  {
    key: 'fire_suppression_ok',
    label: 'מערכת כיבוי אש',
    description: 'חובה להתקין מערכת כיבוי אש תקנית ופעילה בתוך המבנה. תאורה אינטגרלית מתוך המבנה בלבד. אין להציב גופי תאורה חיצוניים או עמודי תאורה פרוביזוריים.',
  },
  {
    key: 'no_alcohol_tobacco',
    label: 'ללא אלכוהול וטבק',
    description: 'אסור למכור או להגיש משקאות אלכוהוליים ומוצרי טבק מהעמדה. שימור מבטים: העמדה לא תסתיר את הנוף הטבעי (ים, נחל) ולא תמוקם על ציר הליכה ראשי או שער כניסה.',
  },
];

export const COMPLIANCE_ITEMS = [
  ...DESIGN_ITEMS,
  ...STRUCTURE_ENV_ITEMS,
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
