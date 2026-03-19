import { Link } from "react-router-dom";
import {
  Building2, User, Users, Map, ChevronLeft,
  ArrowLeftRight, Bell, CheckCircle2, Eye,
  Truck, ShieldCheck, UtensilsCrossed,
} from "lucide-react";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">

      {/* Hero */}
      <section className="premium-hero text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-xs tracking-widest opacity-50 mb-4 uppercase">עיריית אשדוד · מחלקת הנדסה ותכנון עירוני</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            ניהול עמדות מזון במרחב הציבורי
          </h1>
          <p className="text-sm opacity-70 leading-relaxed max-w-md mx-auto">
            בחרו את התפקיד שלכם כדי להתחיל — המערכת תתאים את המסלול עבורכם
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">

        {/* 3 Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">

          {/* Business Owner */}
          <RoleCard
            to="/journey?role=owner"
            icon={Truck}
            iconBg="bg-accent/10"
            iconColor="text-accent"
            title="בעל עסק"
            subtitle="הגשת בקשה להצבת עמדת מזון"
            description="קראו את המדיניות, הגישו בקשה, קבלו אישור ופרסמו את העמדה"
            ctaLabel="צפו במסלול"
            ctaClass="bg-accent text-accent-foreground hover:bg-accent/90"
          />

          {/* Municipality */}
          <RoleCard
            to="/journey?role=city"
            icon={ShieldCheck}
            iconBg="bg-primary/8"
            iconColor="text-primary"
            title="עירייה"
            subtitle="ניהול בקשות ומדיניות הצבה"
            description="קבעו מדיניות, בדקו בקשות, אשרו עמדות ועקבו אחר הפעילות"
            ctaLabel="צפו במסלול"
            ctaClass="bg-primary text-primary-foreground hover:bg-primary/90"
          />

          {/* Resident */}
          <RoleCard
            to="/map"
            icon={UtensilsCrossed}
            iconBg="bg-info/10"
            iconColor="text-info"
            title="תושב"
            subtitle="גלו עמדות אוכל ברחבי העיר"
            description="מפה אינטראקטיבית, תפריטים, שעות פעילות ומיקומים מדויקים"
            ctaLabel="גלו עמדות"
            ctaClass="bg-info text-info-foreground hover:bg-info/90"
          />

        </div>

        {/* How the 3 flows connect */}
        <div className="bg-card rounded-xl border municipal-shadow p-6">
          <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 text-foreground">
            <ArrowLeftRight className="w-4 h-4 text-accent" />
            איך שלושת המסלולים מתחברים
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">

            <FlowCard
              icon={Bell}
              title="הגשת בקשה"
              from="בעל עסק"
              to="עירייה"
              description="ברגע שבעל העסק מגיש בקשה — העירייה מקבלת התראה ומתחילה תהליך בדיקה"
              accent="border-s-4 border-accent"
            />

            <FlowCard
              icon={CheckCircle2}
              title="החלטה והודעה"
              from="עירייה"
              to="בעל עסק"
              description="החלטת העירייה מועברת לבעל העסק עם נימוקים ותנאים"
              accent="border-s-4 border-primary"
            />

            <FlowCard
              icon={Eye}
              title="פרסום ציבורי"
              from="אישור"
              to="תושבים"
              description="לאחר אישור — העמדה מופיעה על המפה הציבורית בזמן אמת"
              accent="border-s-4 border-info"
            />

          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Role Card ── */
function RoleCard({ to, icon: Icon, iconBg, iconColor, title, subtitle, description, ctaLabel, ctaClass }: {
  to: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaClass: string;
}) {
  return (
    <Link
      to={to}
      className="group relative rounded-xl border bg-card p-7 municipal-shadow
        hover:municipal-shadow-lg hover:-translate-y-0.5
        transition-all duration-300 flex flex-col items-center text-center gap-5"
    >
      <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center
        group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>

      <div>
        <p className="text-lg font-bold text-foreground mb-1">{title}</p>
        <p className="text-sm font-medium text-muted-foreground mb-2">{subtitle}</p>
        <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-[200px] mx-auto">
          {description}
        </p>
      </div>

      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
        ${ctaClass} transition-all`}>
        {ctaLabel}
        <ChevronLeft className="w-4 h-4" />
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
    <div className={`bg-muted/40 rounded-lg p-4 ${accent}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium text-foreground">{from}</span>
        <ArrowLeftRight className="w-3 h-3 text-muted-foreground/40" />
        <span className="text-[10px] bg-card rounded-full px-2 py-0.5 border font-medium text-foreground">{to}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
