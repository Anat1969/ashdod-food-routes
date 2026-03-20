import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ArrowLeftRight, Bell, CheckCircle2, Eye,
  Truck, ShieldCheck, UtensilsCrossed,
} from "lucide-react";
import ashdodEmblem from "@/assets/ashdod-emblem.png";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="premium-hero-luxe text-primary-foreground relative overflow-hidden">
        {/* Ambient light layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-right warm glow */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, hsl(39 80% 52%) 0%, transparent 70%)" }}
          />
          {/* Bottom-left cool glow */}
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, hsl(200 80% 60%) 0%, transparent 65%)" }}
          />
          {/* Fine grain texture */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center max-w-3xl">
          {/* Emblem with glow ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl scale-125" />
              <div className="relative h-[72px] w-[72px] rounded-2xl bg-primary-foreground/[0.08] backdrop-blur-md flex items-center justify-center border border-primary-foreground/[0.12] shadow-lg shadow-black/10">
                <img
                  alt="סמל עיריית אשדוד"
                  src={ashdodEmblem}
                  className="h-11 w-auto opacity-95"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </div>
          </div>

          {/* Kicker */}
          <p className="text-[10px] tracking-[0.35em] opacity-35 mb-6 uppercase font-medium">
            עיריית אשדוד · הנדסה ותכנון עירוני
          </p>

          {/* Main headline */}
          <h1 className="text-[2rem] md:text-[3.25rem] font-extrabold mb-4 leading-[1.1] tracking-tight">
            ניהול עמדות מזון
          </h1>
          <p className="text-lg md:text-[1.35rem] font-light text-primary-foreground/55 mb-6 tracking-wide">
            במרחב הציבורי של אשדוד
          </p>

          {/* Accent divider */}
          <div className="flex justify-center mb-7">
            <div className="h-[2px] w-10 bg-accent/60 rounded-full" />
          </div>

          {/* Body */}
          <p className="text-[13px] text-primary-foreground/40 leading-relaxed max-w-md mx-auto">
            רישוי, פיקוח ומיפוי — במערכת אחת מתקדמת
          </p>

          {/* Hero CTA zone */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-bold
                shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]
                transition-all duration-200"
            >
              הגישו בקשה
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary-foreground/[0.08] text-primary-foreground/80
                border border-primary-foreground/[0.1] text-sm font-medium
                hover:bg-primary-foreground/[0.14] hover:text-primary-foreground transition-all duration-200"
            >
              גלו את המפה
            </Link>
          </div>
        </div>

        {/* Bottom fade to page */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Role Cards Section ── */}
      <div className="container mx-auto px-4 pt-6 pb-16 md:pt-8 md:pb-20 max-w-5xl">

        {/* Section label */}
        <div className="text-center mb-12 md:mb-14">
          <p className="text-[10px] font-semibold text-muted-foreground/50 tracking-[0.2em] uppercase mb-2">
            בחרו את הכניסה שלכם
          </p>
          <p className="text-sm text-muted-foreground/70">
            שלוש נקודות גישה — לפי הצורך שלכם
          </p>
        </div>

        {/* ── 3 Role Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-20">

          <RoleCard
            to="/journey?role=owner"
            icon={Truck}
            glowColor="hsl(39 80% 52%)"
            iconBg="bg-accent/10"
            iconColor="text-accent"
            title="בעל עסק"
            subtitle="הגשה ומעקב"
            description="הגישו בקשה, עקבו אחרי התהליך, וקבלו אישור הצבה"
            ctaLabel="למסלול בעל העסק"
            ctaBg="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm shadow-accent/20"
          />

          <RoleCard
            to="/journey?role=city"
            icon={ShieldCheck}
            glowColor="hsl(216 59% 40%)"
            iconBg="bg-primary/8"
            iconColor="text-primary"
            title="עירייה"
            subtitle="בקרה ואישור"
            description="בדקו בקשות, קבעו מדיניות, ואשרו הצבת עמדות"
            ctaLabel="למסלול העירייה"
            ctaBg="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
          />

          <RoleCard
            to="/map"
            icon={UtensilsCrossed}
            glowColor="hsl(200 80% 50%)"
            iconBg="bg-info/8"
            iconColor="text-info"
            title="תושב"
            subtitle="גילוי ומידע"
            description="מפה אינטראקטיבית, תפריטים, שעות פעילות ומיקומים"
            ctaLabel="גלו עמדות במפה"
            ctaBg="bg-info text-info-foreground hover:bg-info/90 shadow-sm shadow-info/20"
          />

        </div>

        {/* ── Flow connection section ── */}
        <div className="bg-card rounded-2xl border municipal-shadow p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-accent/10 mb-3">
              <ArrowLeftRight className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              איך התהליך מתחבר
            </h3>
            <p className="text-xs text-muted-foreground/60 mt-1">
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
              accentColor="border-info/40"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Role Card ── */
function RoleCard({ to, icon: Icon, glowColor, iconBg, iconColor, title, subtitle, description, ctaLabel, ctaBg }: {
  to: string;
  icon: React.ElementType;
  glowColor: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaBg: string;
}) {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl border bg-card municipal-shadow
        hover:municipal-shadow-lg hover:-translate-y-1.5
        transition-all duration-300 ease-out flex flex-col text-center overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowColor }}
      />

      <div className="flex flex-col items-center gap-5 p-8 md:p-10 flex-1">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ background: glowColor }}
          />
          <div className={`relative w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center
            transition-all duration-300`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <p className="text-xl font-bold text-foreground tracking-tight">{title}</p>
          <p className="text-[13px] font-medium text-accent">{subtitle}</p>
        </div>

        <p className="text-xs text-muted-foreground/65 leading-relaxed max-w-[240px]">
          {description}
        </p>

        {/* CTA */}
        <div className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold
          ${ctaBg} transition-all duration-200 mt-auto`}>
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
        <span className="text-xs font-bold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[10px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{from}</span>
        <ArrowLeftRight className="w-3 h-3 text-muted-foreground/30" />
        <span className="text-[10px] bg-card rounded-full px-2.5 py-0.5 border font-medium text-foreground">{to}</span>
      </div>
      <p className="text-xs text-muted-foreground/65 leading-relaxed">{description}</p>
    </div>
  );
}
