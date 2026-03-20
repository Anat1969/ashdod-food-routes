import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ArrowLeftRight, Bell, CheckCircle2, Eye,
  Truck, ShieldCheck, UtensilsCrossed,
} from "lucide-react";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="premium-hero-luxe text-primary-foreground relative overflow-hidden">
        {/* Ambient light layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, hsl(39 75% 55%) 0%, transparent 70%)" }}
          />
          {/* Fine grain texture */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-8 pb-12 md:pt-10 md:pb-16 text-center max-w-3xl">
          {/* Kicker */}
          <p className="text-[10px] tracking-[0.35em] text-primary-foreground/30 mb-3 uppercase font-medium">
            עיריית אשדוד · הנדסה ותכנון עירוני
          </p>

          {/* Main headline */}
          <h1 className="text-[2rem] md:text-[3rem] font-extrabold mb-2.5 leading-[1.08] tracking-tight">
            ניהול עמדות מזון
          </h1>

          {/* Gold accent divider */}
          <div className="flex justify-center mb-3">
            <div className="h-[2px] w-10 rounded-full" style={{ background: "hsl(39 75% 55% / 0.5)" }} />
          </div>

          <p className="text-base md:text-lg font-light text-primary-foreground/45 mb-1.5 tracking-wide">
            במרחב הציבורי של אשדוד
          </p>

          <p className="text-[13px] text-primary-foreground/30 leading-relaxed max-w-sm mx-auto">
            רישוי, פיקוח ומיפוי — במערכת אחת מתקדמת
          </p>

          {/* Hero CTA zone */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold
                shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]
                transition-all duration-200"
            >
              הגישו בקשה
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary-foreground/[0.08] text-primary-foreground/75
                border border-primary-foreground/[0.1] text-sm font-medium
                hover:bg-primary-foreground/[0.14] hover:text-primary-foreground transition-all duration-200"
            >
              גלו את המפה
            </Link>
          </div>
        </div>

        {/* Bottom fade to page */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Role Cards Section ── */}
      <div className="container mx-auto px-4 pt-8 pb-16 md:pt-10 md:pb-20 max-w-5xl relative z-10">

        {/* Section label */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[11px] font-semibold text-muted-foreground/50 tracking-[0.2em] uppercase mb-2">
            בחרו את הכניסה שלכם
          </p>
          <p className="text-[15px] text-muted-foreground/70 leading-relaxed">
            שלוש נקודות גישה — לפי הצורך שלכם
          </p>
        </div>

        {/* ── 3 Role Cards — distinct color system ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-7 mb-16">

          {/* Business Owner — warm gold */}
          <RoleCard
            to="/journey?role=owner"
            icon={Truck}
            accentHsl="39 75% 55%"
            title="בעל עסק"
            subtitle="הגשה ומעקב"
            description="הגישו בקשה להצבת עמדה, עקבו אחרי סטטוס הטיפול וקבלו אישור"
            ctaLabel="למסלול בעל העסק"
          />

          {/* Municipality — deep authoritative blue */}
          <RoleCard
            to="/journey?role=city"
            icon={ShieldCheck}
            accentHsl="216 59% 26%"
            title="עירייה"
            subtitle="בקרה ואישור"
            description="בדקו בקשות חדשות, קבעו מדיניות תכנון ואשרו הצבת עמדות"
            ctaLabel="למסלול העירייה"
          />

          {/* Resident — soft cyan/teal */}
          <RoleCard
            to="/map"
            icon={UtensilsCrossed}
            accentHsl="195 60% 46%"
            title="תושב"
            subtitle="גילוי ומידע"
            description="מפה אינטראקטיבית עם תפריטים, שעות פעילות ומיקומי עמדות"
            ctaLabel="גלו עמדות במפה"
          />

        </div>

        {/* ── Flow connection section ── */}
        <div className="bg-card rounded-2xl border municipal-shadow p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-accent/10 mb-3">
              <ArrowLeftRight className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              איך התהליך מתחבר
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-1.5 leading-relaxed">
              שלושה שלבים — מהגשה ועד פרסום
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <FlowCard
              step="01"
              icon={Bell}
              title="הגשת בקשה"
              from="בעל עסק"
              to="עירייה"
              description="בעל העסק מגיש בקשה — העירייה מקבלת התראה ומתחילה בדיקה"
              accentColor="border-accent/50"
            />
            <FlowCard
              step="02"
              icon={CheckCircle2}
              title="בחינה והחלטה"
              from="עירייה"
              to="בעל עסק"
              description="החלטת העירייה מועברת עם נימוקים, תנאים ולוח זמנים"
              accentColor="border-primary/40"
            />
            <FlowCard
              step="03"
              icon={Eye}
              title="פרסום ציבורי"
              from="אישור"
              to="תושבים"
              description="לאחר אישור — העמדה מופיעה על המפה הציבורית בזמן אמת"
              accentColor="border-primary/30"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Role Card — each with its own accent hsl ── */
function RoleCard({ to, icon: Icon, accentHsl, title, subtitle, description, ctaLabel }: {
  to: string;
  icon: React.ElementType;
  accentHsl: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl border bg-card municipal-shadow
        hover:municipal-shadow-lg hover:-translate-y-1
        transition-all duration-300 ease-out flex flex-col text-center overflow-hidden"
    >
      {/* Top accent bar — uses card's own accent */}
      <div className="h-[3px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `hsl(${accentHsl})` }}
      />

      <div className="flex flex-col items-center gap-4 p-7 md:p-9 flex-1">
        {/* Icon with card-specific tint */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{ background: `hsl(${accentHsl} / 0.1)` }}>
          <Icon className="w-6 h-6" style={{ color: `hsl(${accentHsl})` }} />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-lg font-bold text-foreground tracking-tight">{title}</p>
          <p className="text-[13px] font-semibold" style={{ color: `hsl(${accentHsl})` }}>{subtitle}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
          {description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold
          text-primary-foreground transition-all duration-200 mt-auto shadow-sm"
          style={{ background: `hsl(${accentHsl})` }}>
          {ctaLabel}
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/* ── Flow Card ── */
function FlowCard({ step, icon: Icon, title, from, to, description, accentColor }: {
  step: string;
  icon: React.ElementType;
  title: string;
  from: string;
  to: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div className={`bg-muted/30 rounded-xl p-5 border-s-[3px] ${accentColor}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[10px] font-bold text-muted-foreground/40 tracking-wider">{step}</span>
        <Icon className="w-4 h-4 text-muted-foreground/60" />
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[11px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{from}</span>
        <ArrowLeftRight className="w-3 h-3 text-muted-foreground/30" />
        <span className="text-[11px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{to}</span>
      </div>
      <p className="text-sm text-muted-foreground/70 leading-relaxed">{description}</p>
    </div>
  );
}
