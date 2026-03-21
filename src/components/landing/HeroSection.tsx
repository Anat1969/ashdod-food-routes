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
        {/* Fine grain texture */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-10 pb-6 md:pt-14 md:pb-8 text-center max-w-3xl">
        {/* Kicker */}
        <p className="text-[10px] tracking-[0.35em] text-primary-foreground/30 mb-4 uppercase font-medium">
          עיריית אשדוד · הנדסה ותכנון עירוני
        </p>

        {/* Main headline */}
        <h1 className="text-[1.75rem] md:text-[2.75rem] font-extrabold mb-1.5 leading-[1.1] tracking-tight">
          מערכת חכמה לניהול עמדות מזון
        </h1>
        <p className="text-[1.25rem] md:text-[1.75rem] font-bold text-primary-foreground/60 mb-4 leading-tight">
          במרחב הציבורי של אשדוד
        </p>

        {/* Gold accent divider */}
        <div className="flex justify-center mb-4">
          <div className="h-[2px] w-12 rounded-full" style={{ background: "hsl(39 75% 55% / 0.45)" }} />
        </div>

        {/* Supporting line */}
        <p className="text-[13px] md:text-[15px] text-primary-foreground/35 leading-relaxed max-w-lg mx-auto">
          הגשה, בחינה, אישור, מיפוי וגילוי מיקומים — במערכת אחת ברורה, שקופה ומתקדמת
        </p>
      </div>

      {/* ── Floating Screens Composition ── */}
      <div className="relative container mx-auto px-4 pb-4 max-w-4xl">
        <div className="relative mx-auto" style={{ height: "clamp(220px, 38vw, 380px)" }}>
          {/* Secondary screen — left/back: Municipal Dashboard */}
          <div
            className="absolute rounded-xl border border-primary-foreground/[0.08] overflow-hidden municipal-shadow-lg"
            style={{
              width: "42%",
              height: "78%",
              top: "12%",
              right: "2%",
              transform: "perspective(1200px) rotateY(-3deg)",
              zIndex: 1,
            }}
          >
            <ScreenMockup
              title="לוח בקרה עירוני"
              items={[
                { label: "בקשות ממתינות", value: "12", color: "hsl(39 80% 52%)" },
                { label: "מאושרות", value: "34", color: "hsl(142 70% 40%)" },
                { label: "בבדיקה", value: "8", color: "hsl(200 80% 50%)" },
              ]}
              variant="dashboard"
            />
          </div>

          {/* Main screen — center/front: All Food Trucks Map */}
          <div
            className="absolute rounded-xl border border-primary-foreground/[0.1] overflow-hidden"
            style={{
              width: "54%",
              height: "100%",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <ScreenMockup
              title="מפת כל הפודטראקים"
              items={[]}
              variant="map"
            />
          </div>

          {/* Secondary screen — right/back: Approved Locations Map */}
          <div
            className="absolute rounded-xl border border-primary-foreground/[0.08] overflow-hidden municipal-shadow-lg"
            style={{
              width: "42%",
              height: "78%",
              top: "12%",
              left: "2%",
              transform: "perspective(1200px) rotateY(3deg)",
              zIndex: 1,
            }}
          >
            <ScreenMockup
              title="מפת עמדות מאושרות"
              items={[
                { label: "עמדות פעילות", value: "28", color: "hsl(142 70% 40%)" },
                { label: "אזורים", value: "6", color: "hsl(216 59% 26%)" },
              ]}
              variant="approved"
            />
          </div>
        </div>
      </div>

      {/* Hero CTA */}
      <div className="relative container mx-auto px-4 pt-4 pb-10 md:pb-14 text-center">
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
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background to-transparent" />
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
    <div className="w-full h-full flex flex-col" style={{ background: "hsl(216 59% 18%)" }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[9px] md:text-[10px] text-white/40 font-medium">{title}</span>
      </div>

      {/* Content area */}
      <div className="flex-1 p-2.5 md:p-3">
        {variant === "map" && (
          <div className="w-full h-full rounded-lg relative overflow-hidden" style={{ background: "hsl(216 30% 92%)" }}>
            {/* Map-like grid lines */}
            <div className="absolute inset-0 opacity-30">
              {[20, 40, 60, 80].map((p) => (
                <div key={`h-${p}`} className="absolute w-full border-t border-primary/10" style={{ top: `${p}%` }} />
              ))}
              {[25, 50, 75].map((p) => (
                <div key={`v-${p}`} className="absolute h-full border-r border-primary/10" style={{ right: `${p}%` }} />
              ))}
            </div>
            {/* Map pins */}
            {[
              { t: "25%", r: "30%", c: "hsl(39 80% 52%)" },
              { t: "45%", r: "55%", c: "hsl(142 70% 40%)" },
              { t: "60%", r: "25%", c: "hsl(216 59% 26%)" },
              { t: "35%", r: "70%", c: "hsl(39 80% 52%)" },
              { t: "70%", r: "50%", c: "hsl(142 70% 40%)" },
            ].map((pin, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shadow-sm"
                style={{ top: pin.t, right: pin.r, background: pin.c }}
              />
            ))}
          </div>
        )}

        {(variant === "dashboard" || variant === "approved") && (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-2.5 py-1.5">
                <span className="text-[8px] md:text-[9px] text-white/40">{item.label}</span>
                <span className="text-[10px] md:text-[11px] font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
            {variant === "dashboard" && (
              <div className="mt-1 h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "65%", background: "hsl(39 80% 52% / 0.5)" }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
