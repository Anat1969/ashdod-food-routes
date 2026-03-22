import { Map, MapPin, LayoutDashboard, FileText } from "lucide-react";

const surfaces = [
  {
    icon: Map,
    title: "מפת כל הפודטראקים",
    desc: "איתור מהיר של כל המיקומים",
    accent: "bg-primary/[0.14]",
    iconClr: "text-primary",
  },
  {
    icon: MapPin,
    title: "מפת עמדות מאושרות",
    desc: "גילוי, תמונות ומידע ציבורי",
    accent: "bg-accent/[0.16]",
    iconClr: "text-accent",
  },
  {
    icon: LayoutDashboard,
    title: "לוח בקרה עירוני",
    desc: "ניהול בקשות, סטטוסים והחלטות",
    accent: "bg-info/[0.14]",
    iconClr: "text-info",
  },
  {
    icon: FileText,
    title: "טופס הגשת בקשה",
    desc: "מסלול מובנה וברור לבעל העסק",
    accent: "bg-success/[0.12]",
    iconClr: "text-success",
  },
];

export default function SystemSurfaces() {
  return (
    <section
      className="py-20 md:py-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(216 22% 94%) 0%, hsl(216 18% 91.5%) 50%, hsl(216 22% 94%) 100%)",
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section heading with accent anchor */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="h-[2px] w-7 mx-auto rounded-full bg-accent/60" />
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
            לכל שלב — מסך ייעודי
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
          {surfaces.map((s, i) => (
            <div
              key={i}
              className="group bg-card rounded-xl border border-border/60 p-5 text-center
                shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.07)]
                hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.1)]
                hover:border-border/80
                hover:-translate-y-0.5
                transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${s.accent} mb-4
                  group-hover:scale-105 transition-all duration-300`}
              >
                <s.icon className={`w-[18px] h-[18px] ${s.iconClr}`} strokeWidth={1.8} />
              </div>
              <p className="text-[13px] font-bold text-foreground mb-1.5">{s.title}</p>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
