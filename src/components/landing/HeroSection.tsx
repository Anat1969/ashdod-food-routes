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

/* ── Shared Title Bar ── */
function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06]"
      style={{ background: "hsl(216 59% 13%)" }}>
      <div className="flex gap-1.5">
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: "hsl(0 70% 55% / 0.55)" }} />
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: "hsl(39 80% 52% / 0.55)" }} />
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: "hsl(142 70% 45% / 0.55)" }} />
      </div>
      <span className="text-[8px] md:text-[9px] text-white/35 font-medium mr-1">{title}</span>
    </div>
  );
}

/* ── Map Screen (Center) ── */
function MapScreen() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "hsl(216 59% 15%)" }}>
      <TitleBar title="מפת כל הפודטראקים" />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-[30%] border-l border-white/[0.06] p-2 flex flex-col gap-1.5 overflow-hidden"
          style={{ background: "hsl(216 59% 14%)" }}>
          <div className="rounded bg-white/[0.06] px-2 py-1">
            <div className="h-1 w-full rounded bg-white/10" />
          </div>
          {[
            { name: "פודטראק הים", cat: "דגים", clr: "hsl(39 80% 52%)" },
            { name: "בורגר שף", cat: "המבורגרים", clr: "hsl(142 70% 40%)" },
            { name: "פיצה נאפולי", cat: "איטלקי", clr: "hsl(200 80% 50%)" },
            { name: "שווארמה גולד", cat: "בשרי", clr: "hsl(39 80% 52%)" },
          ].map((t, i) => (
            <div key={i} className={`rounded-lg px-2 py-1.5 ${i === 0 ? 'bg-white/[0.08] border border-white/[0.1]' : 'bg-white/[0.03]'}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.clr }} />
                <span className="text-[7px] md:text-[8px] text-white/60 font-medium truncate">{t.name}</span>
              </div>
              <span className="text-[6px] md:text-[7px] text-white/25 mr-3">{t.cat}</span>
            </div>
          ))}
        </div>
        {/* Map area */}
        <div className="flex-1 relative overflow-hidden" style={{ background: "hsl(216 28% 91%)" }}>
          {/* Roads grid */}
          <div className="absolute inset-0">
            {["28%","48%","70%"].map((t,i) => (
              <div key={`h${i}`} className="absolute w-full h-[1.5px]" style={{ top: t, background: "hsl(216 18% 83%)" }} />
            ))}
            {["22%","50%","75%"].map((r,i) => (
              <div key={`v${i}`} className="absolute h-full w-[1.5px]" style={{ right: r, background: "hsl(216 18% 83%)" }} />
            ))}
            {/* Building blocks */}
            <div className="absolute rounded-[2px]" style={{ top: "6%", right: "25%", width: "20%", height: "18%", background: "hsl(216 22% 87%)" }} />
            <div className="absolute rounded-[2px]" style={{ top: "32%", right: "54%", width: "16%", height: "13%", background: "hsl(216 22% 87%)" }} />
            <div className="absolute rounded-[2px]" style={{ top: "52%", right: "8%", width: "11%", height: "14%", background: "hsl(216 22% 86%)" }} />
            <div className="absolute rounded-[2px]" style={{ top: "74%", right: "30%", width: "18%", height: "10%", background: "hsl(216 22% 88%)" }} />
          </div>
          {/* Pins */}
          {[
            { t: "20%", r: "30%", c: "hsl(39 80% 52%)", s: 11, selected: true },
            { t: "40%", r: "60%", c: "hsl(142 70% 40%)", s: 9, selected: false },
            { t: "62%", r: "18%", c: "hsl(200 80% 50%)", s: 9, selected: false },
            { t: "28%", r: "74%", c: "hsl(39 80% 52%)", s: 10, selected: false },
            { t: "70%", r: "50%", c: "hsl(142 70% 40%)", s: 8, selected: false },
            { t: "48%", r: "38%", c: "hsl(216 59% 35%)", s: 8, selected: false },
          ].map((pin, i) => (
            <div key={i} className="absolute" style={{ top: pin.t, right: pin.r }}>
              <div
                className="rounded-full"
                style={{
                  width: pin.s,
                  height: pin.s,
                  background: pin.c,
                  boxShadow: pin.selected
                    ? `0 0 0 3px ${pin.c.replace(")", " / 0.25)")}, 0 3px 8px ${pin.c.replace(")", " / 0.4)")}`
                    : `0 2px 5px ${pin.c.replace(")", " / 0.35)")}`,
                }}
              />
              {/* Popup on selected */}
              {pin.selected && (
                <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 rounded bg-white shadow-lg px-2 py-1 whitespace-nowrap"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                  <div className="text-[6px] font-bold" style={{ color: "hsl(216 59% 16%)" }}>פודטראק הים</div>
                  <div className="text-[5px]" style={{ color: "hsl(39 80% 52%)" }}>● פעיל</div>
                  <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rotate-45 shadow-sm" />
                </div>
              )}
            </div>
          ))}
          {/* Zoom controls */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
            <div className="w-[14px] h-[14px] rounded bg-white/90 flex items-center justify-center text-[7px] font-bold shadow-sm" style={{ color: "hsl(216 59% 26%)" }}>+</div>
            <div className="w-[14px] h-[14px] rounded bg-white/90 flex items-center justify-center text-[7px] font-bold shadow-sm" style={{ color: "hsl(216 59% 26%)" }}>−</div>
          </div>
          {/* Attribution bar */}
          <div className="absolute bottom-0 inset-x-0 h-3 bg-white/60 flex items-center px-1.5">
            <div className="h-[3px] w-8 rounded bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard Screen (Right) ── */
function DashboardScreen() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "hsl(216 59% 15%)" }}>
      <TitleBar title="לוח בקרה עירוני" />
      <div className="flex-1 p-2 md:p-2.5 space-y-1.5 overflow-hidden">
        {/* KPI row */}
        <div className="flex gap-1.5">
          {[
            { label: "ממתינות", value: "12", clr: "hsl(39 80% 52%)" },
            { label: "מאושרות", value: "34", clr: "hsl(142 70% 40%)" },
            { label: "בבדיקה", value: "8", clr: "hsl(200 80% 50%)" },
          ].map((kpi, i) => (
            <div key={i} className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1.5 text-center">
              <div className="text-[10px] md:text-[13px] font-bold" style={{ color: kpi.clr }}>{kpi.value}</div>
              <div className="text-[6px] md:text-[7px] text-white/30">{kpi.label}</div>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <span className="text-[6px] text-white/25">אחוז אישור</span>
            <span className="text-[6px] text-white/35 font-medium">65%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, hsl(39 80% 52% / 0.6), hsl(39 80% 52% / 0.3))" }} />
          </div>
        </div>
        {/* Table rows */}
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
          <div className="flex items-center px-2 py-1 bg-white/[0.04] border-b border-white/[0.04]">
            <span className="text-[6px] text-white/25 flex-1">שם</span>
            <span className="text-[6px] text-white/25 w-10 text-center">סטטוס</span>
            <span className="text-[6px] text-white/25 w-8 text-center">תאריך</span>
          </div>
          {[
            { name: "פודטראק הים", status: "ממתין", sClr: "hsl(39 80% 52%)" },
            { name: "בורגר שף", status: "מאושר", sClr: "hsl(142 70% 40%)" },
            { name: "פיצה נאפולי", status: "בבדיקה", sClr: "hsl(200 80% 50%)" },
          ].map((row, i) => (
            <div key={i} className="flex items-center px-2 py-1 border-b border-white/[0.03] last:border-0">
              <span className="text-[6px] md:text-[7px] text-white/45 flex-1 truncate">{row.name}</span>
              <span className="text-[5px] md:text-[6px] font-medium w-10 text-center" style={{ color: row.sClr }}>{row.status}</span>
              <span className="text-[5px] text-white/20 w-8 text-center">12/03</span>
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div className="flex gap-1">
          <div className="flex-1 h-4 rounded bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
            <span className="text-[5px] text-white/30">סינון</span>
          </div>
          <div className="flex-1 h-4 rounded bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
            <span className="text-[5px] text-white/30">ייצוא</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Approved Locations Screen (Left) ── */
function ApprovedScreen() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "hsl(216 59% 15%)" }}>
      <TitleBar title="מפת עמדות מאושרות" />
      <div className="flex-1 p-2 md:p-2.5 space-y-1.5 overflow-hidden">
        {/* Stats bar */}
        <div className="flex gap-1.5">
          <div className="flex-1 rounded bg-white/[0.05] border border-white/[0.06] px-2 py-1 text-center">
            <div className="text-[9px] md:text-[11px] font-bold" style={{ color: "hsl(142 70% 40%)" }}>28</div>
            <div className="text-[5px] md:text-[6px] text-white/25">עמדות פעילות</div>
          </div>
          <div className="flex-1 rounded bg-white/[0.05] border border-white/[0.06] px-2 py-1 text-center">
            <div className="text-[9px] md:text-[11px] font-bold" style={{ color: "hsl(216 59% 50%)" }}>6</div>
            <div className="text-[5px] md:text-[6px] text-white/25">אזורים</div>
          </div>
        </div>
        {/* Location cards */}
        {[
          { name: "חוף לידו", zone: "אזור החוף", active: true },
          { name: "פארק אשדוד ים", zone: "פארקים", active: true },
          { name: "שד׳ בן גוריון", zone: "מרכז העיר", active: false },
        ].map((loc, i) => (
          <div key={i} className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-1.5 flex gap-1.5">
            {/* Thumbnail */}
            <div className="w-8 h-6 rounded flex-shrink-0 overflow-hidden" style={{ background: "hsl(216 20% 80%)" }}>
              <div className="w-full h-full" style={{
                background: i === 0
                  ? "linear-gradient(135deg, hsl(200 60% 75%), hsl(200 40% 85%))"
                  : i === 1
                  ? "linear-gradient(135deg, hsl(142 40% 70%), hsl(142 30% 80%))"
                  : "linear-gradient(135deg, hsl(216 30% 78%), hsl(216 20% 86%))"
              }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] md:text-[8px] text-white/55 font-medium truncate">{loc.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1 h-1 rounded-full" style={{ background: loc.active ? "hsl(142 70% 40%)" : "hsl(216 20% 50%)" }} />
                <span className="text-[5px] md:text-[6px] text-white/25">{loc.zone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
