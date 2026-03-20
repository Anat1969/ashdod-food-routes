import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2, User, Users, ChevronRight, ChevronDown,
  ArrowLeftRight, FileText, Upload, CheckCircle2, XCircle,
  Map, UtensilsCrossed, Bell, ClipboardList, Settings,
  ShieldCheck, BarChart3, LogIn, PenLine, Eye, Calendar,
  Megaphone, RefreshCw, AlertCircle, Play, ArrowRight,
  Lock, Truck,
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

/* ─── Color Config — unified: primary (blue), accent (gold), primary-muted ─── */
const ROLES = {
  owner: {
    label: "בעל עסק",
    sub: "הגשת בקשה להצבת עמדת מזון",
    icon: Truck,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    border: "border-accent/30",
    header: "bg-accent",
    text: "text-accent",
    badge: "bg-accent/10 text-accent",
    ring: "ring-accent/30",
    step: "bg-accent",
    light: "bg-accent/5",
    ctaBg: "bg-accent text-accent-foreground hover:bg-accent/90",
    desc: "קראו את המדיניות, הגישו בקשה, קבלו אישור ופרסמו את העמדה",
  },
  city: {
    label: "עירייה",
    sub: "ניהול בקשות ומדיניות הצבה",
    icon: ShieldCheck,
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
    border: "border-primary/20",
    header: "bg-primary",
    text: "text-primary",
    badge: "bg-primary/10 text-primary",
    ring: "ring-primary/20",
    step: "bg-primary",
    light: "bg-primary/5",
    ctaBg: "bg-primary text-primary-foreground hover:bg-primary/90",
    desc: "קבעו מדיניות, בדקו בקשות, אשרו עמדות ועקבו אחר הפעילות",
  },
  resident: {
    label: "תושב",
    sub: "גלו עמדות אוכל ברחבי העיר",
    icon: UtensilsCrossed,
    iconBg: "bg-primary/6",
    iconColor: "text-primary",
    border: "border-primary/15",
    header: "bg-primary",
    text: "text-primary",
    badge: "bg-primary/8 text-primary",
    ring: "ring-primary/15",
    step: "bg-primary",
    light: "bg-primary/4",
    ctaBg: "bg-primary text-primary-foreground hover:bg-primary/90",
    desc: "מפה אינטראקטיבית, תפריטים, שעות פעילות ומיקומים מדויקים",
  },
} as const;

/* ─── Step Data ────────────────────────────────────────── */
const STEPS: Record<RoleKey, Step[]> = {
  owner: [
    { id: "o1", label: "הרשמה לפלטפורמה", icon: LogIn, desc: "צרו חשבון בעל עסק עם כתובת אימייל", cta: { label: "הירשמו", to: "/register" } },
    { id: "o2", label: "קראו את המדיניות", icon: FileText, desc: "הכירו את דרישות העירייה, הנחיות העיצוב והאזורים המותרים", cta: { label: "למדיניות", to: "/policy" }, intersect: "מדיניות שקובעת העירייה" },
    { id: "o3", label: "סקרו אזורים מותרים", icon: Map, desc: "5 אזורי אופי בעיר עם דרישות עיצוב ותשתיות ייחודיות", cta: { label: "לאזורי האופי", to: "/zones" }, intersect: "אזורים שהוגדרו ע״י העירייה" },
    { id: "o4", label: "מלאו את טופס הבקשה", icon: PenLine, desc: "פרטי העסק, קטגוריית מזון ושעות פעילות", cta: { label: "התחילו בקשה", to: "/apply" }, highlight: true },
    { id: "o5", label: "העלו מסמכים ותמונות", icon: Upload, desc: "רישיון עסק, תמונות העמדה ומוקאפ עיצובי" },
    { id: "o6", label: "הגישו את הבקשה", icon: Bell, desc: "הבקשה עוברת לסקירת מחלקת ההנדסה", highlight: true, intersect: "העירייה מקבלת התראה" },
    { id: "o7", label: "קבלו משוב ותקנו", icon: RefreshCw, desc: "הנחיות לתיקון — שלב זה עשוי לחזור עד לאישור", intersect: "תשובה ממחלקת הנדסה" },
    { id: "o8", label: "קבלו אישור סופי", icon: CheckCircle2, desc: "אישור כולל תנאי היתר ותקופת תוקף", highlight: true, intersect: "אישור/דחייה מהעירייה", cta: { label: "מעקב בקשות", to: "/dashboard" } },
    { id: "o9", label: "פרסמו את העמדה", icon: Eye, desc: "העמדה מופיעה על המפה הציבורית", intersect: "תושבים רואים את העמדה" },
    { id: "o10", label: "נהלו תפריט ואירועים", icon: Settings, desc: "עדכנו תפריט, שעות ופעילות שוטפת", cta: { label: "ניהול שוטף", to: "/dashboard" }, intersect: "תושבים רואים כל עדכון" },
  ],
  city: [
    { id: "c1", label: "כניסת מנהל", icon: Lock, desc: "גישה לפאנל הניהול עם הרשאות מנהל", cta: { label: "כניסה לניהול", to: "/admin-login" } },
    { id: "c2", label: "קבעו מדיניות", icon: Settings, desc: "כללים, מגבלות ודרישות עיצוב לפי תקן עירוני", cta: { label: "עדכון מדיניות", to: "/policy" }, intersect: "מחייב את בעלי העסקים", highlight: true },
    { id: "c3", label: "הגדירו אזורים", icon: Map, desc: "5 אזורים עם אפיון ייחודי לכל אחד", cta: { label: "אפיון אזורים", to: "/zones" }, intersect: "בעלי עסקים בוחרים מהרשימה" },
    { id: "c4", label: "קבלו בקשה חדשה", icon: Bell, desc: "בקשה מגיעה ללוח הבקרה עם כל המסמכים", highlight: true, intersect: "בקשה נשלחה ע״י בעל עסק", cta: { label: "ללוח בקרה", to: "/admin" } },
    { id: "c5", label: "בדקו מסמכים", icon: ClipboardList, desc: "סקרו רישיון, תמונות והדמיה עיצובית", cta: { label: "לרשימת הבקשות", to: "/admin" } },
    { id: "c6", label: "רשימת ציות", icon: ShieldCheck, desc: "10 פרמטרים: גמישות, חומרים, גימור, שילוט ועוד" },
    { id: "c7", label: "חוות דעת מומחה", icon: Eye, desc: "ניתוח מפורט על עיצוב, מיקום ואיכות סביבתית" },
    { id: "c8", label: "אשרו או דחו", icon: CheckCircle2, desc: "החלטה עם נימוקים — בעל העסק מקבל הודעה", highlight: true, intersect: "הודעה אוטומטית לבעל העסק", cta: { label: "ללוח בקרה", to: "/admin" } },
    { id: "c9", label: "עקבו אחר עמדות", icon: Eye, desc: "ספרייה מלאה עם סינון לפי סטטוס ומיקום", cta: { label: "לספרייה", to: "/directory" } },
    { id: "c10", label: "ניתוח נתונים", icon: BarChart3, desc: "סטטיסטיקות ובחינה מחדש של המדיניות", cta: { label: "ללוח בקרה", to: "/admin" } },
  ],
  resident: [
    { id: "r1", label: "גישה חופשית", icon: Users, desc: "אין צורך בהרשמה — כל המידע פתוח לציבור" },
    { id: "r2", label: "מפת עמדות", icon: Map, desc: "מפה אינטראקטיבית עם כל העמדות המאושרות", cta: { label: "למפה", to: "/map" }, intersect: "רק עמדות מאושרות", highlight: true },
    { id: "r3", label: "סננו וחפשו", icon: UtensilsCrossed, desc: "סננו לפי קטגוריה: המבורגר, פיצה, אסיאתי ועוד", cta: { label: "לחיפוש", to: "/map" } },
    { id: "r4", label: "פרטי העמדה", icon: FileText, desc: "שם, סוג אוכל, תמונות ומיקום מדויק", intersect: "מעודכן ע״י בעל העסק" },
    { id: "r5", label: "תפריט ומחירים", icon: ClipboardList, desc: "תפריט מלא עם מחירים עדכניים", intersect: "מנוהל ע״י בעל העסק" },
    { id: "r6", label: "מיקום ושעות", icon: Map, desc: "כתובת, שכונה וימי פעילות" },
    { id: "r7", label: "אירועים מיוחדים", icon: Calendar, desc: "מבצעים ואירועים שמפרסם בעל העמדה", intersect: "פורסם ע״י בעל העסק", cta: { label: "לאירועים", to: "/map" } },
    { id: "r8", label: "גלו עמדות", icon: Megaphone, desc: "תוכן שיווקי ומבצעים ממוקדים", cta: { label: "גלו עמדות", to: "/advertisement" } },
  ],
};

/* ─── Intersections ────────────────────────────────────── */
const INTERSECTIONS = [
  { from: "בעל עסק", to: "עירייה", icon: Bell, title: "הגשת בקשה", desc: "ברגע שבעל העסק מגיש — העירייה מקבלת התראה ומתחילה בדיקה", accent: "border-s-4 border-accent" },
  { from: "עירייה", to: "בעל עסק", icon: CheckCircle2, title: "החלטה והודעה", desc: "החלטת העירייה מועברת לבעל העסק עם נימוקים ותנאים", accent: "border-s-4 border-primary" },
  { from: "אישור", to: "תושבים", icon: Eye, title: "פרסום ציבורי", desc: "לאחר אישור — העמדה מופיעה על המפה הציבורית", accent: "border-s-4 border-primary/60" },
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
        group relative rounded-xl border p-4 cursor-pointer transition-all duration-200
        ${isActive
          ? `${role.light} ${role.border} municipal-shadow ring-1 ${role.ring}`
          : "bg-card border-border hover:border-muted-foreground/20 hover:municipal-shadow"
        }
        ${step.highlight && !isActive ? "border-dashed" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Step Number */}
        <div className={`
          flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
          text-xs font-bold transition-colors
          ${isActive ? `${role.step} text-white` : "bg-muted text-muted-foreground"}
        `}>
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? role.iconColor : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
            {step.highlight && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${role.badge}`}>
                שלב מפתח
              </span>
            )}
          </div>

          {isActive && (
            <div className="mt-2.5">
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>

              {step.intersect && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-accent bg-accent/5 border border-accent/20 rounded-lg px-2 py-1.5">
                  <ArrowLeftRight className="w-3 h-3 flex-shrink-0" />
                  <span>{step.intersect}</span>
                </div>
              )}

              {step.cta && (
                <Link
                  to={step.cta.to}
                  onClick={e => e.stopPropagation()}
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all municipal-shadow hover:municipal-shadow-lg hover:-translate-y-0.5
                    ${role.ctaBg}`}
                >
                  <Play className="w-3.5 h-3.5" />
                  {step.cta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <ChevronDown className={`
          flex-shrink-0 w-4 h-4 transition-transform duration-200
          ${isActive ? `rotate-180 ${role.text}` : "text-muted-foreground/30"}
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
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${role.step} transition-all duration-500`}
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium flex-shrink-0 tabular-nums">
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
            onClick={() => setActiveStep(i)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {activeStep > 0 && (
          <button
            onClick={() => setActiveStep(s => s - 1)}
            className="flex-1 py-2.5 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            ← שלב קודם
          </button>
        )}
        {activeStep < steps.length - 1 && (
          <button
            onClick={() => setActiveStep(s => s + 1)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all
              ${role.step} hover:opacity-90`}
          >
            השלב הבא →
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
      className="group relative w-full text-right rounded-xl border bg-card p-7
        municipal-shadow hover:municipal-shadow-lg hover:-translate-y-0.5
        transition-all duration-300 flex flex-col items-center text-center gap-5"
    >
      <div className={`w-16 h-16 rounded-2xl ${r.iconBg} flex items-center justify-center
        group-hover:scale-105 transition-transform duration-300`}>
        <RIcon className={`w-7 h-7 ${r.iconColor}`} />
      </div>

      <div>
        <p className="text-lg font-bold text-foreground mb-1">{r.label}</p>
        <p className={`text-sm font-medium ${r.text} mb-2`}>{r.sub}</p>
        <p className="text-[13px] text-muted-foreground/70 leading-relaxed max-w-[200px] mx-auto">{r.desc}</p>
      </div>

      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
        ${r.ctaBg} transition-all`}>
        צפו במסלול
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function UserJourneyMap() {
  const [searchParams] = useSearchParams();
  const paramRole = searchParams.get("role") as RoleKey | null;
  const validRole = paramRole && (["owner", "city", "resident"] as RoleKey[]).includes(paramRole) ? paramRole : null;
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(validRole);

  return (
    <div dir="rtl" className="min-h-screen bg-background">

      {/* Hero — unified brand gradient */}
      <section className="premium-hero-deep text-primary-foreground py-10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-xs tracking-widest text-primary-foreground/40 mb-3 uppercase">ניהול עמדות מזון · אשדוד</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">מסלולי משתמשים</h1>
          <p className="text-sm text-primary-foreground/55 leading-relaxed">
            בחרו את התפקיד שלכם — נציג את המסלול המותאם עבורכם
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-5xl">

        {!selectedRole ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {(["owner", "city", "resident"] as RoleKey[]).map(key => (
                <RoleCard key={key} roleKey={key} onClick={() => setSelectedRole(key)} />
              ))}
            </div>

            {/* Intersections */}
            <div className="bg-card rounded-xl border municipal-shadow p-6">
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 text-foreground">
                <ArrowLeftRight className="w-4 h-4 text-accent" />
                איך שלושת המסלולים מתחברים
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {INTERSECTIONS.map((c, i) => {
                  const IIcon = c.icon;
                  return (
                    <div key={i} className={`bg-muted/40 rounded-lg p-4 ${c.accent}`}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <IIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium">{c.from}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium">{c.to}</span>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div>
            {/* Active role header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${ROLES[selectedRole].iconBg} flex items-center justify-center`}>
                  {(() => { const RI = ROLES[selectedRole].icon; return <RI className={`w-5 h-5 ${ROLES[selectedRole].iconColor}`} />; })()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{ROLES[selectedRole].label}</h2>
                  <p className="text-[13px] text-muted-foreground">{ROLES[selectedRole].sub}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                בחירת תפקיד אחר
              </button>
            </div>

            <JourneyPanel roleKey={selectedRole} />

            {/* Intersections */}
            <div className="mt-12 bg-card rounded-xl border municipal-shadow p-6">
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 text-foreground">
                <ArrowLeftRight className="w-4 h-4 text-accent" />
                נקודות חיבור בין המסלולים
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {INTERSECTIONS.map((c, i) => {
                  const IIcon = c.icon;
                  return (
                    <div key={i} className={`bg-muted/40 rounded-lg p-4 ${c.accent}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <IIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium">{c.from}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
                        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium">{c.to}</span>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
