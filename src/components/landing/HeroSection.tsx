import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import heroMapAshdod from "@/assets/hero-map-ashdod.png";

export default function HeroSection() {
  const compRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<null | "center" | "left" | "right">(null);
  const [idle, setIdle] = useState({ x: 0, y: 0 });

  // Gentle idle breathing
  useEffect(() => {
    let frame: number;
    let t = 0;
    const tick = () => {
      t += 0.006;
      setIdle({
        x: Math.sin(t * 0.7) * 0.08,
        y: Math.cos(t * 0.5) * 0.05,
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = compRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
    setHovered(null);
  }, []);

  const mx = mouse.x || idle.x;
  const my = mouse.y || idle.y;

  // Stronger parallax — rear screens move significantly more
  const centerTx = mx * -6;
  const centerTy = my * -3.5;
  const leftTx = mx * -16;
  const leftTy = my * -8;
  const rightTx = mx * -14;
  const rightTy = my * -7;

  // Stronger hover lift & scale
  const liftCenter = hovered === "center" ? -7 : 0;
  const liftLeft = hovered === "left" ? -9 : 0;
  const liftRight = hovered === "right" ? -9 : 0;

  const scaleCenter = hovered === "center" ? 1.018 : 1;
  const scaleLeft = hovered === "left" ? 1.03 : 1;
  const scaleRight = hovered === "right" ? 1.03 : 1;

  const transition = "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease";

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
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-16 pb-4 md:pt-24 md:pb-6 text-center max-w-3xl">
        {/* Kicker */}
        <p className="text-[10px] tracking-[0.35em] text-primary-foreground/25 mb-7 uppercase font-medium">
          עיריית אשדוד · הנדסה ותכנון עירוני
        </p>

        {/* Main headline */}
        <h1 className="text-[1.75rem] md:text-[2.75rem] font-extrabold mb-2.5 leading-[1.08] tracking-tight">
          מערכת חכמה לניהול עמדות מזון
        </h1>
        <p className="text-[1.2rem] md:text-[1.65rem] font-bold text-primary-foreground/55 mb-7 leading-tight">
          במרחב הציבורי של אשדוד
        </p>

        {/* Gold accent divider */}
        <div className="flex justify-center mb-7">
          <div className="h-[2px] w-10 rounded-full" style={{ background: "hsl(39 75% 55% / 0.4)" }} />
        </div>

        {/* Supporting line */}
        <p className="text-[13px] md:text-[14px] text-primary-foreground/30 leading-[1.8] max-w-md mx-auto mb-2">
          הגשה, בחינה, אישור, מיפוי וגילוי מיקומים — במערכת אחת ברורה, שקופה ומתקדמת
        </p>
      </div>

      {/* ── Floating Screens Composition ── */}
      <div
        ref={compRef}
        className="relative mx-auto pb-2 md:pb-4"
        style={{ maxWidth: "1060px" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="relative mx-auto"
          style={{ height: "clamp(240px, 38vw, 400px)", perspective: "2200px" }}
        >

          {/* Secondary screen — LEFT/back: Approved Locations */}
          <div
            className="absolute rounded-xl overflow-hidden"
            onPointerEnter={() => setHovered("left")}
            onPointerLeave={() => setHovered(null)}
            style={{
              width: "34%",
              height: "65%",
              top: "24%",
              left: "-6%",
              clipPath: "inset(0 0 0 8% round 12px)",
              transform: `rotateY(10deg) rotateZ(-1.5deg) scale(${0.78 * scaleLeft}) translate(${leftTx}px, ${leftTy + liftLeft}px)`,
              transformOrigin: "center center",
              zIndex: 1,
              boxShadow: hovered === "left"
                ? "0 35px 80px rgba(0,0,0,0.38), 0 16px 35px rgba(0,0,0,0.22)"
                : "0 22px 55px rgba(0,0,0,0.26), 0 10px 24px rgba(0,0,0,0.14)",
              border: "1px solid rgba(255,255,255,0.04)",
              filter: hovered === "left" ? "brightness(0.88) saturate(0.94)" : "brightness(0.78) saturate(0.85)",
              transition,
              willChange: "transform",
            }}
          >
            <ApprovedScreen />
          </div>

          {/* Secondary screen — RIGHT/back: Municipal Dashboard */}
          <div
            className="absolute rounded-xl overflow-hidden"
            onPointerEnter={() => setHovered("right")}
            onPointerLeave={() => setHovered(null)}
            style={{
              width: "36%",
              height: "68%",
              top: "20%",
              right: "-4%",
              clipPath: "inset(0 8% 0 0 round 12px)",
              transform: `rotateY(-9deg) rotateZ(1deg) scale(${0.8 * scaleRight}) translate(${rightTx}px, ${rightTy + liftRight}px)`,
              transformOrigin: "center center",
              zIndex: 2,
              boxShadow: hovered === "right"
                ? "0 36px 82px rgba(0,0,0,0.35), 0 16px 34px rgba(0,0,0,0.22)"
                : "0 24px 60px rgba(0,0,0,0.28), 0 10px 26px rgba(0,0,0,0.16)",
              border: "1px solid rgba(255,255,255,0.05)",
              filter: hovered === "right" ? "brightness(0.9) saturate(0.95)" : "brightness(0.8) saturate(0.87)",
              transition,
              willChange: "transform",
            }}
          >
            <DashboardScreen />
          </div>

          {/* Main screen — CENTER/front: All Food Trucks Map */}
          <div
            className="absolute rounded-2xl overflow-hidden"
            onPointerEnter={() => setHovered("center")}
            onPointerLeave={() => setHovered(null)}
            style={{
              width: "40%",
              height: "95%",
              top: "2%",
              left: "50%",
              transform: `translateX(-50%) translateZ(60px) scale(${scaleCenter}) translate(${centerTx}px, ${centerTy + liftCenter}px)`,
              zIndex: 10,
              boxShadow: hovered === "center"
                ? "0 44px 110px rgba(0,0,0,0.58), 0 20px 48px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 36px 90px rgba(0,0,0,0.52), 0 16px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
              transition,
              willChange: "transform",
            }}
          >
            <MapScreen />
          </div>

        </div>
      </div>

      {/* Hero CTA */}
      <div className="relative container mx-auto px-4 pt-10 pb-16 md:pt-12 md:pb-24 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/journey"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold
              shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 hover:scale-[1.03]
              transition-all duration-200"
          >
            צפו במסלולים
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link
            to="/advertisement"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary-foreground/[0.07] text-primary-foreground/70
              border border-primary-foreground/[0.08] text-sm font-medium
              hover:bg-primary-foreground/[0.13] hover:text-primary-foreground/90 transition-all duration-200"
          >
            מפת עמדות מאושרות
          </Link>
        </div>
      </div>

      {/* Bottom fade — ultra-clean transition */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <div className="h-16" style={{
          background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 50%, transparent 100%)"
        }} />
      </div>
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
        <div className="flex-1 relative overflow-hidden">
          <img
            src={heroMapAshdod}
            alt="מפת אשדוד"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          {/* Overlay pins */}
          {[
            { t: "32%", r: "42%", c: "hsl(0 70% 50%)", s: 11, selected: true },
            { t: "55%", r: "25%", c: "hsl(39 80% 52%)", s: 9, selected: false },
            { t: "22%", r: "60%", c: "hsl(142 70% 40%)", s: 9, selected: false },
            { t: "68%", r: "55%", c: "hsl(200 80% 50%)", s: 8, selected: false },
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
          <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
            <div className="w-[14px] h-[14px] rounded bg-white/90 flex items-center justify-center text-[7px] font-bold shadow-sm" style={{ color: "hsl(216 59% 26%)" }}>+</div>
            <div className="w-[14px] h-[14px] rounded bg-white/90 flex items-center justify-center text-[7px] font-bold shadow-sm" style={{ color: "hsl(216 59% 26%)" }}>−</div>
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
        <div className="space-y-0.5">
          <div className="flex justify-between">
            <span className="text-[6px] text-white/25">אחוז אישור</span>
            <span className="text-[6px] text-white/35 font-medium">65%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, hsl(39 80% 52% / 0.6), hsl(39 80% 52% / 0.3))" }} />
          </div>
        </div>
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
        {[
          { name: "חוף לידו", zone: "אזור החוף", active: true },
          { name: "פארק אשדוד ים", zone: "פארקים", active: true },
          { name: "שד׳ בן גוריון", zone: "מרכז העיר", active: false },
        ].map((loc, i) => (
          <div key={i} className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-1.5 flex gap-1.5">
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
