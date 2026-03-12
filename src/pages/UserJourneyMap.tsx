import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, User, Users,
  ChevronDown, ArrowLeftRight,
  FileText, Upload, CheckCircle2, XCircle,
  Map, UtensilsCrossed, Star, Bell,
  ClipboardList, Settings, ShieldCheck, BarChart3,
  LogIn, PenLine, Eye, Calendar, Megaphone,
  AlertCircle, RefreshCw,
} from "lucide-react";

/* ─── Color Tokens ─────────────────────────────────────── */
const ROLES = {
  owner: {
    key: "owner",
    label: "בעל עסק",
    sub: "פודטראק",
    icon: User,
    color: "orange",
    bg: "bg-orange-50",
    border: "border-orange-300",
    header: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
    arrow: "text-orange-400",
    ring: "ring-orange-300",
  },
  city: {
    key: "city",
    label: "עירייה",
    sub: "מחלקת הנדסה",
    icon: Building2,
    color: "teal",
    bg: "bg-teal-50",
    border: "border-teal-300",
    header: "bg-teal-600",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
    dot: "bg-teal-400",
    arrow: "text-teal-400",
    ring: "ring-teal-300",
  },
  resident: {
    key: "resident",
    label: "תושב",
    sub: "הציבור הרחב",
    icon: Users,
    color: "violet",
    bg: "bg-violet-50",
    border: "border-violet-300",
    header: "bg-violet-600",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
    arrow: "text-violet-400",
    ring: "ring-violet-300",
  },
} as const;

type RoleKey = keyof typeof ROLES;

/* ─── Step Types ───────────────────────────────────────── */
interface Step {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  to?: string;
  intersect?: string; // label for cross-lane connection
  intersectDir?: "right" | "left" | "both";
  highlight?: boolean;
}

/* ─── Owner Steps ──────────────────────────────────────── */
const ownerSteps: Step[] = [
  { id: "o1", label: "הרשמה לפלטפורמה", desc: "יצירת חשבון בעל עסק", icon: LogIn, to: "/register" },
  { id: "o2", label: "קריאת מדיניות והנחיות", desc: "הכרת דרישות העירייה", icon: FileText, to: "/policy" },
  { id: "o3", label: "סקירת אזורים מותרים", desc: "בחירת אזור ומיקום מתאים", icon: Map, to: "/zones" },
  { id: "o4", label: "מילוי טופס בקשה", desc: "3 שלבים: פרטים, מיקום, עיצוב", icon: PenLine, to: "/apply" },
  { id: "o5", label: "העלאת מסמכים", desc: "רישיון עסק, תמונות, פוטו עיצוב", icon: Upload },
  {
    id: "o6", label: "הגשה לבדיקה", desc: "הבקשה מועברת לעירייה",
    icon: Bell, intersect: "העירייה מקבלת התראה", intersectDir: "left", highlight: true,
  },
  { id: "o7", label: "קבלת משוב ותיקונים", desc: "עדכון לפי הנחיות הבודק", icon: RefreshCw },
  {
    id: "o8", label: "קבלת אישור", desc: "הודעת אישור / דחייה ממחלקת הנדסה",
    icon: CheckCircle2, intersect: "תגובת העירייה", intersectDir: "left", highlight: true,
  },
  { id: "o9", label: "פרסום פרופיל ציבורי", desc: "העמדה מופיעה במפה הציבורית", icon: Eye, intersect: "תושבים רואים", intersectDir: "right", highlight: true },
  { id: "o10", label: "ניהול תפריט ואירועים", desc: "עדכון מחירים, שעות, מבצעים", icon: UtensilsCrossed, to: "/dashboard" },
];

/* ─── City Steps ───────────────────────────────────────── */
const citySteps: Step[] = [
  { id: "c1", label: "כניסת מנהל", desc: "גישה לפאנל ניהול העירייה", icon: ShieldCheck, to: "/admin-login" },
  { id: "c2", label: "קביעת מדיניות", desc: "הגדרת כללים ומגבלות לפעילות", icon: Settings, to: "/policy" },
  { id: "c3", label: "הגדרת אזורים ואפיון", desc: "5 אזורים עם דרישות עיצוב ייחודיות", icon: Map, to: "/zones" },
  {
    id: "c4", label: "קבלת בקשה חדשה", desc: "בקשה מבעל עסק מגיעה לדשבורד",
    icon: Bell, intersect: "בקשה מבעל עסק", intersectDir: "right", highlight: true,
  },
  { id: "c5", label: "סקירה ובדיקת מסמכים", desc: "בדיקת רישיון, תמונות ועיצוב", icon: ClipboardList, to: "/admin" },
  { id: "c6", label: "רשימת תיוג ציות עיצובי", desc: "10 פרמטרים: גמישות, חומרים, שילוט…", icon: CheckCircle2 },
  { id: "c7", label: "חוות דעת מומחה", desc: "ניתוח אדריכלי ועירוני מפורט", icon: Star },
  {
    id: "c8", label: "אישור / דחייה", desc: "עדכון סטטוס + שליחת הודעה לבעל עסק",
    icon: XCircle, intersect: "הודעה לבעל עסק", intersectDir: "right", highlight: true,
  },
  { id: "c9", label: "מעקב עמדות פעילות", desc: "ספרייה עם סינון וחיפוש", icon: Eye, to: "/directory" },
  { id: "c10", label: "ניתוח נתונים ובקרה", desc: "סטטיסטיקות, דוחות ביצועים", icon: BarChart3, to: "/admin" },
];

/* ─── Resident Steps ───────────────────────────────────── */
const residentSteps: Step[] = [
  { id: "r1", label: "גישה ציבורית", desc: "ללא הרשמה – פתוח לכולם", icon: Users },
  { id: "r2", label: "מפת עמדות פעילות", desc: "כל הפודטראקים המאושרים על המפה", icon: Map, to: "/map" },
  { id: "r3", label: "סינון לפי קטגוריה", desc: "המבורגר, פיצה, אסיאתי, קינוחים…", icon: UtensilsCrossed, to: "/map" },
  {
    id: "r4", label: "צפייה בעמדות מאושרות בלבד", desc: "רק עמדות שאושרו ע\"י העירייה",
    icon: ShieldCheck, intersect: "אישור עירייה", intersectDir: "left", highlight: true,
  },
  { id: "r5", label: "פרטי עמדה ותפריט", desc: "מחירים, מגוון, תמונות האוכל", icon: FileText },
  { id: "r6", label: "שעות פעילות ומיקום", desc: "כתובת מדויקת, ימי פעילות", icon: Calendar },
  {
    id: "r7", label: "אירועים ומבצעים", desc: "עדכונים שמפרסם בעל העמדה",
    icon: Megaphone, intersect: "פרסום בעל עסק", intersectDir: "left", highlight: true,
  },
  { id: "r8", label: "פרסומות ומיתוג", desc: "מודעות ממוקדות לפי אזור", icon: Star, to: "/advertisement" },
];

/* ─── Arrow component ─────────────────────────────────── */
function DownArrow({ color }: { color: string }) {
  return (
    <div className={`flex justify-center my-1 ${color}`}>
      <ChevronDown className="w-5 h-5 opacity-60" />
    </div>
  );
}

/* ─── Intersection Badge ──────────────────────────────── */
function IntersectBadge({ label, dir }: { label: string; dir?: "right" | "left" | "both" }) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-1"
      style={{ [dir === "left" ? "right" : "left"]: "-6.5rem" }}>
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-sm">
        <ArrowLeftRight className="w-3 h-3" />
        {label}
      </div>
    </div>
  );
}

/* ─── Single Step Card ───────────────────────────────── */
function StepCard({ step, role, index }: { step: Step; role: typeof ROLES[RoleKey]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="relative">
      {step.intersect && (
        <IntersectBadge label={step.intersect} dir={step.intersectDir} />
      )}
      <div className={`
        relative rounded-xl border p-3.5 transition-all duration-200
        ${role.bg} ${role.border}
        ${step.highlight ? `ring-2 ${role.ring} shadow-md` : "shadow-sm"}
        ${step.to ? "hover:shadow-md cursor-pointer" : ""}
      `}>
        <div className="flex items-start gap-3">
          {/* Step number */}
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold
            flex items-center justify-center text-white
            ${role.header}
          `}>
            {index + 1}
          </div>
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${role.header} bg-opacity-15`}>
            <Icon className={`w-4 h-4 text-white opacity-90`} />
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{step.label}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
          </div>
          {/* Intersection indicator */}
          {step.intersect && (
            <AlertCircle className="flex-shrink-0 w-4 h-4 text-yellow-500 mt-0.5" />
          )}
        </div>
        {step.to && (
          <Link to={step.to} className={`
            mt-2.5 w-full flex items-center justify-center gap-1.5
            text-xs font-medium py-1.5 px-3 rounded-lg border
            ${role.badge} hover:opacity-80 transition-opacity
          `}>
            כניסה לדף ←
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── Lane Component ──────────────────────────────────── */
function Lane({ role, steps, active, onClick }: {
  role: typeof ROLES[RoleKey];
  steps: Step[];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = role.icon;
  return (
    <div className={`flex flex-col gap-0 transition-all duration-300 ${active ? "opacity-100" : "opacity-40 hover:opacity-60"}`}>
      {/* Header button */}
      <button
        onClick={onClick}
        className={`
          ${role.header} text-white rounded-2xl p-4 text-center mb-4
          shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95
          ${active ? "ring-4 ring-white/30 shadow-xl" : ""}
        `}
      >
        <Icon className="w-8 h-8 mx-auto mb-2 opacity-90" />
        <p className="text-lg font-bold">{role.label}</p>
        <p className="text-xs opacity-80 mt-0.5">{role.sub}</p>
        <div className={`mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium`}>
          {active ? "✓ מסלול פעיל" : "לחץ להפעלה"}
        </div>
      </button>

      {/* Steps */}
      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => (
          <div key={step.id}>
            <StepCard step={step} role={role} index={i} />
            {i < steps.length - 1 && <DownArrow color={role.arrow} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Legend ──────────────────────────────────────────── */
function Legend() {
  return (
    <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-600 mt-6 px-4">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm ring-2 ring-yellow-400 bg-yellow-50" />
        <span>נקודת חיבור בין גורמים</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300" />
        <span>צעד בעל עסק</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-teal-100 border border-teal-300" />
        <span>צעד עירייה</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-violet-100 border border-violet-300" />
        <span>צעד תושב</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ArrowLeftRight className="w-3 h-3 text-yellow-500" />
        <span>קשר בין מסלולים</span>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function UserJourneyMap() {
  const [activeRoles, setActiveRoles] = useState<Set<RoleKey>>(new Set(["owner", "city", "resident"]));

  function toggle(key: RoleKey) {
    setActiveRoles(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const allActive = activeRoles.size === 3;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">מפת מסלולי משתמשים</h1>
          <p className="text-sm opacity-80 leading-relaxed">
            תרשים זרימה מלא של שלושת הגורמים במערכת — בעל עסק, עירייה ותושב — וחיבורי הגומלין ביניהם
          </p>
        </div>
      </section>

      {/* Controls */}
      <div className="container mx-auto px-4 pt-6 max-w-6xl">
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <p className="text-sm font-semibold text-center mb-3 text-gray-700">בחר מסלולים להצגה</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {(Object.keys(ROLES) as RoleKey[]).map(key => {
              const r = ROLES[key];
              const RIcon = r.icon;
              const active = activeRoles.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all
                    ${active ? `${r.header} text-white border-transparent shadow-md` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}
                  `}
                >
                  <RIcon className="w-4 h-4" />
                  {r.label}
                  {active && <span className="text-xs opacity-80">✓</span>}
                </button>
              );
            })}
            <button
              onClick={() => setActiveRoles(new Set(["owner", "city", "resident"]))}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              הצג הכל
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(ROLES) as RoleKey[]).map(key => {
            const r = ROLES[key];
            const RIcon = r.icon;
            return (
              <div key={key} className={`${r.bg} ${r.border} border rounded-xl p-3 text-center`}>
                <RIcon className={`w-5 h-5 mx-auto mb-1 ${r.header} text-white p-0.5 rounded`} />
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[10px] text-gray-500">
                  {key === "owner" ? "10 שלבים" : key === "city" ? "10 שלבים" : "8 שלבים"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Chart */}
      <div className="container mx-auto px-4 pb-12 max-w-6xl">
        <div className={`grid gap-6 ${
          allActive || activeRoles.size === 3
            ? "grid-cols-1 lg:grid-cols-3"
            : activeRoles.size === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 max-w-md mx-auto"
        }`}>
          {activeRoles.has("owner") && (
            <Lane role={ROLES.owner} steps={ownerSteps} active={activeRoles.has("owner")} onClick={() => toggle("owner")} />
          )}
          {activeRoles.has("city") && (
            <Lane role={ROLES.city} steps={citySteps} active={activeRoles.has("city")} onClick={() => toggle("city")} />
          )}
          {activeRoles.has("resident") && (
            <Lane role={ROLES.resident} steps={residentSteps} active={activeRoles.has("resident")} onClick={() => toggle("resident")} />
          )}
        </div>

        <Legend />

        {/* Cross-flow summary */}
        <div className="mt-8 bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-yellow-500" />
            נקודות חיבור בין מסלולים
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                from: "בעל עסק",
                to: "עירייה",
                event: "הגשת בקשה",
                desc: "כשבעל העסק מגיש בקשה, העירייה מקבלת התראה ומתחילה תהליך בדיקה",
                color: "from-orange-100 to-teal-100 border-orange-200",
              },
              {
                from: "עירייה",
                to: "בעל עסק",
                event: "אישור / דחייה",
                desc: "החלטת העירייה מועברת אוטומטית לבעל העסק עם פירוט ותנאים",
                color: "from-teal-100 to-orange-100 border-teal-200",
              },
              {
                from: "בעל עסק",
                to: "תושב",
                event: "פרסום עמדה",
                desc: "לאחר אישור, פרופיל העמדה עם תפריט ואירועים נראה לתושבים במפה",
                color: "from-orange-100 to-violet-100 border-violet-200",
              },
            ].map((c, i) => (
              <div key={i} className={`bg-gradient-to-l ${c.color} border rounded-xl p-3.5`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-white rounded-full px-2 py-0.5 border">{c.from}</span>
                  <ArrowLeftRight className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-bold bg-white rounded-full px-2 py-0.5 border">{c.to}</span>
                </div>
                <p className="text-sm font-semibold mb-1">{c.event}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
