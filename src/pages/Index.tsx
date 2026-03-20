import { Link } from "react-router-dom";
import {
  Building2, ChevronLeft,
  ArrowLeftRight, Bell, CheckCircle2, Eye,
  Truck, ShieldCheck, UtensilsCrossed,
} from "lucide-react";
import ashdodEmblem from "@/assets/ashdod-emblem.png";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="premium-hero-deep text-primary-foreground relative overflow-hidden">
        {/* Subtle geometric accent */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, hsl(0 0% 100%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(0 0% 100%) 0%, transparent 40%)",
          }}
        />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-2xl">
          {/* Emblem */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10">
              <img
                alt="סמל עיריית אשדוד"
                src={ashdodEmblem}
                className="h-10 w-auto opacity-90"
                style={{ filter: "brightness(0) invert(1)", mixBlendMode: "screen" }}
              />
            </div>
          </div>

          <p className="text-[11px] tracking-[0.25em] opacity-40 mb-5 uppercase font-medium">
            עיריית אשדוד · מחלקת הנדסה ותכנון עירוני
          </p>

          <h1 className="text-3xl md:text-[2.75rem] font-bold mb-5 leading-[1.2] tracking-tight">
            ניהול עמדות מזון
            <br />
            <span className="text-primary-foreground/70 font-medium text-2xl md:text-3xl">
              במרחב הציבורי
            </span>
          </h1>

          <p className="text-sm opacity-50 leading-relaxed max-w-sm mx-auto">
            מערכת מוניציפלית לניהול רישוי, פיקוח ומיפוי עמדות מזון ברחבי העיר
          </p>

          {/* Accent line */}
          <div className="mt-8 flex justify-center">
            <div className="h-px w-16 bg-accent/50 rounded-full" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14 md:py-16 max-w-5xl">

        {/* Section label */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-muted-foreground/60 tracking-wide uppercase">
            בחרו את התפקיד שלכם
          </p>
        </div>

        {/* ── 3 Role Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7 mb-16">

          <RoleCard
            to="/journey?role=owner"
            icon={Truck}
            accentClass="group-hover:bg-accent/12"
            iconColor="text-accent"
            title="בעל עסק"
            subtitle="הגשת בקשה להצבת עמדה"
            description="הגישו בקשה, עקבו אחר הסטטוס, וקבלו אישור הצבה"
            ctaLabel="צפו במסלול"
            ctaAccent="bg-accent text-accent-foreground hover:bg-accent/90"
            borderAccent="hover:border-accent/30"
          />

          <RoleCard
            to="/journey?role=city"
            icon={ShieldCheck}
            accentClass="group-hover:bg-primary/8"
            iconColor="text-primary"
            title="עירייה"
            subtitle="ניהול בקשות ומדיניות"
            description="בדקו בקשות, קבעו מדיניות הצבה, ואשרו עמדות"
            ctaLabel="צפו במסלול"
            ctaAccent="bg-primary text-primary-foreground hover:bg-primary/90"
            borderAccent="hover:border-primary/25"
          />

          <RoleCard
            to="/map"
            icon={UtensilsCrossed}
            accentClass="group-hover:bg-info/8"
            iconColor="text-info"
            title="תושב"
            subtitle="גלו עמדות אוכל ברחבי העיר"
            description="מפה אינטראקטיבית, תפריטים, שעות ומיקומים"
            ctaLabel="גלו עמדות"
            ctaAccent="bg-info text-info-foreground hover:bg-info/90"
            borderAccent="hover:border-info/25"
          />

        </div>

        {/* ── Flow connection section ── */}
        <div className="bg-card rounded-2xl border municipal-shadow p-7 md:p-8">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2.5 text-foreground">
            <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <ArrowLeftRight className="w-3.5 h-3.5 text-accent" />
            </div>
            איך שלושת המסלולים מתחברים
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <FlowCard
              icon={Bell}
              title="הגשת בקשה"
              from="בעל עסק"
              to="עירייה"
              description="בעל העסק מגיש בקשה — העירייה מקבלת התראה ומתחילה בדיקה"
              accent="border-s-[3px] border-accent/60"
            />
            <FlowCard
              icon={CheckCircle2}
              title="החלטה והודעה"
              from="עירייה"
              to="בעל עסק"
              description="החלטת העירייה מועברת עם נימוקים, תנאים ולוח זמנים"
              accent="border-s-[3px] border-primary/50"
            />
            <FlowCard
              icon={Eye}
              title="פרסום ציבורי"
              from="אישור"
              to="תושבים"
              description="לאחר אישור — העמדה מופיעה על המפה הציבורית בזמן אמת"
              accent="border-s-[3px] border-info/50"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Role Card ── */
function RoleCard({ to, icon: Icon, accentClass, iconColor, title, subtitle, description, ctaLabel, ctaAccent, borderAccent }: {
  to: string;
  icon: React.ElementType;
  accentClass: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaAccent: string;
  borderAccent: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative rounded-2xl border bg-card p-8 md:p-9 municipal-shadow
        hover:municipal-shadow-lg hover:-translate-y-1
        transition-all duration-300 ease-out flex flex-col items-center text-center gap-6
        ${borderAccent}`}
    >
      {/* Icon badge */}
      <div className={`w-14 h-14 rounded-xl bg-muted/60 ${accentClass} flex items-center justify-center
        transition-all duration-300`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-bold text-foreground">{title}</p>
        <p className="text-[13px] font-medium text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-[220px] mx-auto">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold
        ${ctaAccent} transition-all duration-200 mt-auto`}>
        {ctaLabel}
        <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      </div>
    </Link>
  );
}

/* ── Flow Card ── */
function FlowCard({ icon: Icon, title, from, to, description, accent }: {
  icon: React.ElementType;
  title: string;
  from: string;
  to: string;
  description: string;
  accent: string;
}) {
  return (
    <div className={`bg-muted/30 rounded-xl p-5 ${accent}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground/70" />
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[10px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{from}</span>
        <ArrowLeftRight className="w-3 h-3 text-muted-foreground/30" />
        <span className="text-[10px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{to}</span>
      </div>
      <p className="text-xs text-muted-foreground/70 leading-relaxed">{description}</p>
    </div>
  );
}
