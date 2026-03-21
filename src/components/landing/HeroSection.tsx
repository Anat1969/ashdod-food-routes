import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="premium-hero-luxe text-primary-foreground relative overflow-hidden">
      {/* Ambient light layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-[0.045]"
          style={{ background: "radial-gradient(circle, hsl(39 75% 55%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsl(216 59% 60%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-14 pb-8 md:pt-20 md:pb-10 text-center max-w-3xl">
        {/* Kicker */}
        <p className="text-[10px] tracking-[0.35em] text-primary-foreground/30 mb-5 uppercase font-medium">
          עיריית אשדוד · הנדסה ותכנון עירוני
        </p>

        {/* Main headline */}
        <h1 className="text-[1.75rem] md:text-[2.75rem] font-extrabold mb-1.5 leading-[1.1] tracking-tight">
          מערכת חכמה לניהול עמדות מזון
        </h1>
        <p className="text-[1.25rem] md:text-[1.75rem] font-bold text-primary-foreground/60 mb-5 leading-tight">
          במרחב הציבורי של אשדוד
        </p>

        {/* Gold accent divider */}
        <div className="flex justify-center mb-5">
          <div className="h-[2px] w-12 rounded-full" style={{ background: "hsl(39 75% 55% / 0.45)" }} />
        </div>

        {/* Supporting line */}
        <p className="text-[13px] md:text-[15px] text-primary-foreground/35 leading-relaxed max-w-lg mx-auto">
          הגשה, בחינה, אישור, מיפוי וגילוי מיקומים — במערכת אחת ברורה, שקופה ומתקדמת
        </p>
      </div>

      {/* ── Floating Screens Composition ── */}
      <div className="relative container mx-auto px-4 pb-8 max-w-5xl">
        <div className="relative mx-auto" style={{ height: "clamp(280px, 44vw, 460px)" }}>

          {/* Secondary screen — LEFT/back: Approved Locations */}
          <div
            className="absolute rounded-xl overflow-hidden"
            style={{
              width: "42%",
              height: "78%",
              top: "12%",
              left: "-4%",
              transform: "perspective(1800px) rotateY(-6deg) scale(0.88)",
              zIndex: 2,
              boxShadow: "0 16px 60px rgba(0,0,0,0.25), 0 6px 20px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.06)",
              filter: "brightness(0.92)",
            }}
          >
            <ApprovedScreen />
          </div>

          {/* Secondary screen — RIGHT/back: Municipal Dashboard */}
          <div
            className="absolute rounded-xl overflow-hidden"
            style={{
              width: "42%",
              height: "78%",
              top: "12%",
              right: "-4%",
              transform: "perspective(1800px) rotateY(6deg) scale(0.88)",
              zIndex: 2,
              boxShadow: "0 16px 60px rgba(0,0,0,0.25), 0 6px 20px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.06)",
              filter: "brightness(0.92)",
            }}
          >
            <DashboardScreen />
          </div>

          {/* Main screen — CENTER/front: All Food Trucks Map */}
          <div
            className="absolute rounded-2xl overflow-hidden"
            style={{
              width: "52%",
              height: "100%",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              boxShadow: "0 25px 80px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1), 0 0 100px rgba(0,0,0,0.15)",
            }}
          >
            <MapScreen />
          </div>

        </div>
      </div>

      {/* Hero CTA */}
      <div className="relative container mx-auto px-4 pt-6 pb-14 md:pb-20 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/journey"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold
              shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]
              transition-all duration-200"
          >
            צפו במסלולים
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link
            to="/advertisement"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary-foreground/[0.08] text-primary-foreground/75
              border border-primary-foreground/[0.1] text-sm font-medium
              hover:bg-primary-foreground/[0.14] hover:text-primary-foreground transition-all duration-200"
          >
            מפת עמדות מאושרות
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

/* ── Screen Mockup ── */
function ScreenMockup({
  title,
  items,
  variant,
}: {
  title: string;
  items: { label: string; value: string; color: string }[];
  variant: "map" | "dashboard" | "approved";
}) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "hsl(216 59% 16%)" }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]"
        style={{ background: "hsl(216 59% 14%)" }}>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0 70% 55% / 0.6)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(39 80% 52% / 0.6)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "hsl(142 70% 45% / 0.6)" }} />
        </div>
        <span className="text-[9px] md:text-[10px] text-white/40 font-medium mr-1">{title}</span>
      </div>

      {/* Content area */}
      <div className="flex-1 p-2.5 md:p-3">
        {variant === "map" && <MapContent />}
        {(variant === "dashboard" || variant === "approved") && (
          <DashboardContent items={items} variant={variant} />
        )}
      </div>
    </div>
  );
}

function MapContent() {
  return (
    <div className="w-full h-full rounded-lg relative overflow-hidden" style={{ background: "hsl(216 30% 90%)" }}>
      {/* Road-like lines */}
      <div className="absolute inset-0">
        {/* Horizontal roads */}
        <div className="absolute w-full h-[2px]" style={{ top: "30%", background: "hsl(216 20% 82%)" }} />
        <div className="absolute w-full h-[2px]" style={{ top: "55%", background: "hsl(216 20% 82%)" }} />
        <div className="absolute w-full h-[2px]" style={{ top: "78%", background: "hsl(216 20% 84%)" }} />
        {/* Vertical roads */}
        <div className="absolute h-full w-[2px]" style={{ right: "25%", background: "hsl(216 20% 82%)" }} />
        <div className="absolute h-full w-[2px]" style={{ right: "55%", background: "hsl(216 20% 82%)" }} />
        <div className="absolute h-full w-[2px]" style={{ right: "80%", background: "hsl(216 20% 84%)" }} />
        {/* Block fills */}
        <div className="absolute rounded-sm" style={{ top: "8%", right: "28%", width: "22%", height: "18%", background: "hsl(216 25% 86%)" }} />
        <div className="absolute rounded-sm" style={{ top: "34%", right: "58%", width: "18%", height: "17%", background: "hsl(216 25% 87%)" }} />
        <div className="absolute rounded-sm" style={{ top: "60%", right: "10%", width: "12%", height: "14%", background: "hsl(216 25% 86%)" }} />
      </div>
      {/* Map pins with drop shadows */}
      {[
        { t: "22%", r: "32%", c: "hsl(39 80% 52%)", s: "12px" },
        { t: "42%", r: "58%", c: "hsl(142 70% 40%)", s: "10px" },
        { t: "65%", r: "22%", c: "hsl(216 59% 35%)", s: "10px" },
        { t: "30%", r: "72%", c: "hsl(39 80% 52%)", s: "11px" },
        { t: "72%", r: "48%", c: "hsl(142 70% 40%)", s: "9px" },
        { t: "15%", r: "50%", c: "hsl(200 80% 50%)", s: "9px" },
      ].map((pin, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: pin.t,
            right: pin.r,
            width: pin.s,
            height: pin.s,
            background: pin.c,
            boxShadow: `0 2px 6px ${pin.c.replace(")", " / 0.4)")}`,
          }}
        />
      ))}
      {/* Zoom controls hint */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
        <div className="w-4 h-4 rounded bg-white/80 flex items-center justify-center text-[8px] text-primary/60 font-bold shadow-sm">+</div>
        <div className="w-4 h-4 rounded bg-white/80 flex items-center justify-center text-[8px] text-primary/60 font-bold shadow-sm">−</div>
      </div>
    </div>
  );
}

function DashboardContent({
  items,
  variant,
}: {
  items: { label: string; value: string; color: string }[];
  variant: "dashboard" | "approved";
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between bg-white/[0.05] rounded-lg px-2.5 py-1.5">
          <span className="text-[8px] md:text-[9px] text-white/40">{item.label}</span>
          <span className="text-[10px] md:text-[12px] font-bold" style={{ color: item.color }}>
            {item.value}
          </span>
        </div>
      ))}
      {variant === "dashboard" && (
        <>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "65%", background: "hsl(39 80% 52% / 0.5)" }} />
          </div>
          <div className="flex gap-1.5 mt-1.5">
            <div className="flex-1 h-6 rounded bg-white/[0.04] border border-white/[0.06]" />
            <div className="flex-1 h-6 rounded bg-white/[0.04] border border-white/[0.06]" />
          </div>
        </>
      )}
      {variant === "approved" && (
        <div className="mt-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5">
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 h-4 rounded bg-white/[0.05]" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
