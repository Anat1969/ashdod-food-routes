import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2, User, Users, ChevronRight, ChevronDown,
  ArrowLeftRight, FileText, Upload, CheckCircle2, XCircle,
  Map, UtensilsCrossed, Bell, ClipboardList, Settings,
  ShieldCheck, BarChart3, LogIn, PenLine, Eye, Calendar,
  Megaphone, RefreshCw, AlertCircle, Play, ArrowRight,
  Sparkles, Lock,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────── */
type RoleKey = "owner" | "city" | "resident";

interface Step {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  cta?: { label: string; to: string };
  intersect?: string;
  highlight?: boolean;
}

/* ─── Color Config ─────────────────────────────────────── */
const ROLES = {
  owner: {
    label: "בעל עסק",
    sub: "הגש בקשה לפודטראק",
    emoji: "🚚",
    icon: User,
    bg: "bg-orange-50",
    border: "border-orange-200",
    header: "bg-orange-500",
    headerHover: "hover:bg-orange-600",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    ring: "ring-orange-400",
    step: "bg-orange-500",
    light: "bg-orange-100",
    gradient: "from-orange-500 to-amber-500",
    desc: "קרא את המדיניות, הגש בקשה, קבל אישור ופרסם את הפרופיל שלך",
  },
  city: {
    label: "עירייה",
    sub: "נהל בקשות ומדיניות",
    emoji: "🏛️",
    icon: Building2,
    bg: "bg-teal-50",
    border: "border-teal-200",
    header: "bg-teal-600",
    headerHover: "hover:bg-teal-700",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    ring: "ring-teal-400",
    step: "bg-teal-600",
    light: "bg-teal-100",
    gradient: "from-teal-600 to-cyan-500",
    desc: "קבע מדיניות, בדוק בקשות, אשר עמדות ועקוב אחר הפעילות בעיר",
  },
  resident: {
    label: "תושב",
    sub: "מצא מקום לאכול",
    emoji: "👥",
    icon: Users,
    bg: "bg-violet-50",
    border: "border-violet-200",
    header: "bg-violet-600",
    headerHover: "hover:bg-violet-700",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    ring: "ring-violet-400",
    step: "bg-violet-600",
    light: "bg-violet-100",
    gradient: "from-violet-600 to-purple-500",
    desc: "גלה עמדות אוכל פעילות בעיר, ראה תפריטים, שעות ואירועים מיוחדים",
  },
} as const;

/* ─── Step Data ────────────────────────────────────────── */
const STEPS: Record<RoleKey, Step[]> = {
  owner: [
    {
      id: "o1", label: "הרשמה לפלטפורמה", icon: LogIn,
      desc: "צור חשבון בעל עסק עם כתובת אימייל או חשבון גוגל",
      cta: { label: "הירשם עכשיו", to: "/register" },
    },
    {
      id: "o2", label: "קרא את המדיניות", icon: FileText,
      desc: "הכר את דרישות העירייה, הנחיות העיצוב והאזורים המותרים להצבה",
      cta: { label: "לדף המדיניות", to: "/policy" },
      intersect: "מדיניות שקובעת העירייה",
    },
    {
      id: "o3", label: "סקור אזורים מותרים", icon: Map,
      desc: "5 אזורי אופי בעיר, כל אחד עם דרישות עיצוב ותשתיות ייחודיות",
      cta: { label: "לאזורי האופי", to: "/zones" },
      intersect: "אזורים שהוגדרו על ידי העירייה",
    },
    {
      id: "o4", label: "מלא את טופס הבקשה", icon: PenLine,
      desc: "3 שלבים: פרטי העסק ובעל הרישיון, סוג הרכב ומיקום, הנחיות עיצוב",
      cta: { label: "התחל בקשה חדשה", to: "/apply" },
      highlight: true,
    },
    {
      id: "o5", label: "העלה מסמכים ותמונות", icon: Upload,
      desc: "רישיון עסק, תמונות הרכב מכל הכיוונים, תמונת אוויר ומוקאפ עיצובי",
    },
    {
      id: "o6", label: "הגש את הבקשה", icon: Bell,
      desc: "הבקשה עוברת לסקירת מחלקת ההנדסה ומקבלת מספר מעקב",
      highlight: true,
      intersect: "העירייה מקבלת התראה ומתחילה בדיקה",
    },
    {
      id: "o7", label: "קבל משוב ותקן", icon: RefreshCw,
      desc: "הודעת אימייל עם הנחיות לתיקון — ייתכן שלב זה חוזר עד לאישור",
      intersect: "תשובה ממחלקת הנדסה בעירייה",
    },
    {
      id: "o8", label: "קבל אישור סופי", icon: CheckCircle2,
      desc: "אישור מהעירייה כולל תנאי ההיתר ותקופת תוקף הרישיון",
      highlight: true,
      intersect: "אישור/דחייה – הגיע מהעירייה",
      cta: { label: "מעקב בקשות שלי", to: "/dashboard" },
    },
    {
      id: "o9", label: "פרסם את הפרופיל", icon: Eye,
      desc: "הפרופיל מופיע למפה הציבורית עם כל פרטי העמדה ותמונות",
      intersect: "תושבים יכולים לראות אותך על המפה",
    },
    {
      id: "o10", label: "נהל תפריט ואירועים", icon: Settings,
      desc: "עדכן תפריט ומחירים, שעות פעילות ואירועים מיוחדים בכל עת",
      cta: { label: "לניהול השוטף", to: "/dashboard" },
      intersect: "תושבים רואים כל עדכון בזמן אמת",
    },
  ],
  city: [
    {
      id: "c1", label: "כניסת מנהל", icon: Lock,
      desc: "גישה לפאנל הניהול עם הרשאות מנהל מחלקת הנדסה",
      cta: { label: "כניסה לפאנל ניהול", to: "/admin-login" },
    },
    {
      id: "c2", label: "קבע מדיניות", icon: Settings,
      desc: "הגדר כללים, מגבלות תפעוליות ודרישות עיצוב לפי תקן עירוני",
      cta: { label: "עדכן מדיניות", to: "/policy" },
      intersect: "מחייב את בעלי העסקים",
      highlight: true,
    },
    {
      id: "c3", label: "הגדר אזורים ואפיון", icon: Map,
      desc: "5 אזורים עם אפיון ייחודי: חוף יוקרה, מרינה, חוף אינטנסיבי, נחל לכיש, מבצר",
      cta: { label: "לאפיון אזורים", to: "/zones" },
      intersect: "בעלי עסקים בוחרים מהרשימה",
    },
    {
      id: "c4", label: "קבל בקשה חדשה", icon: Bell,
      desc: "בקשה מבעל עסק מגיעה לדשבורד עם כל המסמכים המצורפים",
      highlight: true,
      intersect: "בקשה נשלחה על ידי בעל עסק",
      cta: { label: "לדשבורד ניהול", to: "/admin" },
    },
    {
      id: "c5", label: "בדוק מסמכים", icon: ClipboardList,
      desc: "סקור רישיון עסק, תמונות הרכב, הדמיה עיצובית ותמונות אוויר",
      cta: { label: "לרשימת הבקשות", to: "/admin" },
    },
    {
      id: "c6", label: "רשימת תיוג ציות", icon: ShieldCheck,
      desc: "10 פרמטרים: גמישות, חומרים וצבע, איכות גימור, שילוט, תאורה ועוד",
    },
    {
      id: "c7", label: "חוות דעת מומחה", icon: Eye,
      desc: "אדריכל מוסמך כותב ניתוח מפורט על עיצוב, מיקום ואיכות סביבתית",
    },
    {
      id: "c8", label: "אשר או דחה", icon: CheckCircle2,
      desc: "קביעת החלטה עם נימוקים — הבקשה מתעדכנת ובעל העסק מקבל הודעה",
      highlight: true,
      intersect: "הודעה אוטומטית לבעל העסק",
      cta: { label: "לדשבורד ניהול", to: "/admin" },
    },
    {
      id: "c9", label: "עקוב אחר עמדות פעילות", icon: Eye,
      desc: "ספרייה מלאה עם סינון, מיון וחיפוש לפי סטטוס, מיקום וקטגוריה",
      cta: { label: "לספרייה המלאה", to: "/directory" },
    },
    {
      id: "c10", label: "ניתוח נתונים ובקרה", icon: BarChart3,
      desc: "סטטיסטיקות שימוש, מגמות ובחינה מחדש של המדיניות לפי הצורך",
      cta: { label: "לדשבורד ניהול", to: "/admin" },
    },
  ],
  resident: [
    {
      id: "r1", label: "גישה חופשית", icon: Users,
      desc: "אין צורך בהרשמה — כל המידע פתוח לציבור הרחב ללא תשלום",
    },
    {
      id: "r2", label: "מפת עמדות פעילות", icon: Map,
      desc: "מפה אינטראקטיבית עם כל פודטראקי העיר — רק עמדות שאושרו על ידי העירייה",
      cta: { label: "פתח את המפה", to: "/map" },
      intersect: "מוצגות רק עמדות מאושרות על ידי העירייה",
      highlight: true,
    },
    {
      id: "r3", label: "סנן וחפש", icon: UtensilsCrossed,
      desc: "סנן לפי קטגוריה: המבורגר, פיצה, אסיאתי, קינוחים, ים תיכוני, שתייה",
      cta: { label: "לחיפוש מתקדם", to: "/map" },
    },
    {
      id: "r4", label: "פרטי העמדה", icon: FileText,
      desc: "שם העמדה, סוג האוכל, תמונות, שעות פעילות ומיקום מדויק על המפה",
      intersect: "מעודכן בזמן אמת על ידי בעל העסק",
    },
    {
      id: "r5", label: "תפריט ומחירים", icon: ClipboardList,
      desc: "צפה בתפריט המלא עם מחירים עדכניים ומגוון המנות",
      intersect: "מנוהל ישירות על ידי בעל העסק",
    },
    {
      id: "r6", label: "מיקום ושעות", icon: Map,
      desc: "כתובת מדויקת, שכונה, ניווט GPS וימי פעילות שבועיים",
    },
    {
      id: "r7", label: "אירועים מיוחדים", icon: Calendar,
      desc: "מבצעים, פופ-אפים ואירועים מיוחדים שמפרסם בעל העמדה",
      intersect: "פורסם על ידי בעל העסק",
      cta: { label: "לכל אירועי האוכל", to: "/map" },
    },
    {
      id: "r8", label: "פרסום ומיתוג", icon: Megaphone,
      desc: "מודעות ממוקדות, מבצעים לפי אזור ותוכן שיווקי של בעלי העמדות",
      cta: { label: "לדף הפרסום", to: "/advertisement" },
    },
  ],
};

/* ─── Intersection Summary ─────────────────────────────── */
const INTERSECTIONS = [
  {
    from: "בעל עסק",
    to: "עירייה",
    icon: Bell,
    title: "הגשת בקשה",
    desc: "ברגע שבעל העסק מגיש — העירייה מקבלת התראה ומתחילה תהליך בדיקה אוטומטי",
    color: "from-orange-100 to-teal-100 border-l-4 border-teal-400",
  },
  {
    from: "עירייה",
    to: "בעל עסק",
    icon: CheckCircle2,
    title: "החלטת אישור/דחייה",
    desc: "החלטת העירייה מועברת מיידית לבעל העסק עם נימוקים ותנאים",
    color: "from-teal-100 to-orange-100 border-l-4 border-orange-400",
  },
  {
    from: "אישור + בעל עסק",
    to: "תושבים",
    icon: Eye,
    title: "פרסום ציבורי",
    desc: "לאחר אישור הבקשה ועדכון הפרופיל — העמדה מופיעה למפה הציבורית",
    color: "from-orange-100 to-violet-100 border-l-4 border-violet-400",
  },
];

/* ─── Step Card ────────────────────────────────────────── */
function StepCard({
  step, role, index, isActive, onClick,
}: {
  step: Step;
  role: typeof ROLES[RoleKey];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;
  return (
    <div
      className={`
        group relative rounded-2xl border-2 p-4 cursor-pointer
        transition-all duration-200
        ${isActive
          ? `${role.bg} ${role.border} shadow-lg ring-2 ${role.ring}`
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
        }
        ${step.highlight && !isActive ? "border-dashed" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Step Number */}
        <div className={`
          flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
          text-xs font-bold text-white transition-colors
          ${isActive ? role.step : "bg-gray-300 group-hover:bg-gray-400"}
        `}>
          {index + 1}
        </div>

        {/* Icon */}
        <div className={`
          flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors
          ${isActive ? `${role.step} text-white` : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}
        `}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-600"}`}>
              {step.label}
            </span>
            {step.highlight && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${role.badge}`}>
                שלב מפתח
              </span>
            )}
          </div>

          {isActive && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>

              {step.intersect && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                  <ArrowLeftRight className="w-3 h-3 flex-shrink-0" />
                  <span>{step.intersect}</span>
                </div>
              )}

              {step.cta && (
                <Link
                  to={step.cta.to}
                  onClick={e => e.stopPropagation()}
                  className={`
                    mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
                    bg-gradient-to-l ${role.gradient}
                  `}
                >
                  <Play className="w-3.5 h-3.5" />
                  {step.cta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Expand icon */}
        <ChevronDown className={`
          flex-shrink-0 w-4 h-4 transition-transform duration-200
          ${isActive ? `rotate-180 ${role.text}` : "text-gray-300"}
        `} />
      </div>
    </div>
  );
}

/* ─── Journey Panel ────────────────────────────────────── */
function JourneyPanel({ roleKey }: { roleKey: RoleKey }) {
  const [activeStep, setActiveStep] = useState(0);
  const role = ROLES[roleKey];
  const steps = STEPS[roleKey];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-l ${role.gradient} transition-all duration-500`}
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium flex-shrink-0">
          {activeStep + 1} / {steps.length}
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            role={role}
            index={i}
            isActive={activeStep === i}
            onClick={() => setActiveStep(i === activeStep ? i : i)}
          />
        ))}
      </div>

      {/* Next / Prev navigation */}
      <div className="flex gap-3 mt-6">
        {activeStep > 0 && (
          <button
            onClick={() => setActiveStep(s => s - 1)}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← שלב קודם
          </button>
        )}
        {activeStep < steps.length - 1 && (
          <button
            onClick={() => setActiveStep(s => s + 1)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all
              bg-gradient-to-l ${role.gradient} hover:shadow-md hover:-translate-y-0.5`}
          >
            השלב הבא ←
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Role Selector Card ───────────────────────────────── */
function RoleCard({ roleKey, onClick }: { roleKey: RoleKey; onClick: () => void }) {
  const r = ROLES[roleKey];
  const RIcon = r.icon;
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full text-right rounded-3xl border-2 p-6
        bg-white border-gray-100 hover:border-transparent
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 overflow-hidden
      `}
    >
      {/* Gradient blob on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0
        group-hover:opacity-5 transition-opacity duration-300 rounded-3xl
      `} />

      <div className="relative flex flex-col items-center gap-4">
        {/* Icon circle */}
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center text-3xl
          ${r.light} transition-all duration-300
          group-hover:scale-110 group-hover:shadow-lg
        `}>
          {r.emoji}
        </div>

        {/* Label */}
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 mb-1">{r.label}</p>
          <p className={`text-sm font-medium ${r.text} mb-2`}>{r.sub}</p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-[180px]">{r.desc}</p>
        </div>

        {/* Start button */}
        <div className={`
          flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white
          bg-gradient-to-l ${r.gradient} shadow-md
          group-hover:shadow-lg transition-all
        `}>
          <Sparkles className="w-4 h-4" />
          התחל מסלול
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function UserJourneyMap() {
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">מערכת ניהול פודטראקס · אשדוד</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">מי אתה במערכת?</h1>
          <p className="text-sm opacity-75 leading-relaxed">
            בחר את התפקיד שלך — נציג לך את מסלול הפעולות המותאם אישית
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Role selection */}
        {!selectedRole ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {(["owner", "city", "resident"] as RoleKey[]).map(key => (
                <RoleCard key={key} roleKey={key} onClick={() => setSelectedRole(key)} />
              ))}
            </div>

            {/* Intersections preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-700">
                <ArrowLeftRight className="w-4 h-4 text-amber-500" />
                איך שלושת המסלולים מתחברים
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {INTERSECTIONS.map((c, i) => {
                  const IIcon = c.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-l ${c.color} rounded-xl p-3.5`}>
                      <div className="flex items-center gap-2 mb-2">
                        <IIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-bold text-gray-700">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">{c.from}</span>
                        <ArrowLeftRight className="w-3 h-3 text-gray-300" />
                        <span className="text-[10px] bg-white rounded-full px-2 py-0.5 border font-medium">{c.to}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Journey wizard */
          <>
            {/* Role header */}
            <div className={`
              rounded-2xl p-5 mb-6 text-white
              bg-gradient-to-l ${ROLES[selectedRole].gradient} shadow-lg
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ROLES[selectedRole].emoji}</span>
                  <div>
                    <p className="text-lg font-bold">{ROLES[selectedRole].label}</p>
                    <p className="text-sm opacity-80">{ROLES[selectedRole].sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-xs opacity-80 hover:opacity-100 bg-white/20 rounded-xl px-3 py-1.5 transition-all hover:bg-white/30"
                >
                  ← החלף תפקיד
                </button>
              </div>
            </div>

            {/* Journey steps */}
            <JourneyPanel roleKey={selectedRole} />

            {/* Other roles teasers */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center mb-4">עניין אותך לראות גם את המסלולים האחרים?</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {(["owner", "city", "resident"] as RoleKey[]).filter(k => k !== selectedRole).map(key => {
                  const r = ROLES[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedRole(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                        ${r.badge} ${r.border} hover:shadow-md`}
                    >
                      <span>{r.emoji}</span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
