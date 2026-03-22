import { Map, MapPin, LayoutDashboard, FileText } from "lucide-react";

const surfaces = [
  {
    icon: Map,
    title: "מפת כל הפודטראקים",
    desc: "איתור מהיר של כל המיקומים",
    accent: "bg-primary/[0.12]",
  },
  {
    icon: MapPin,
    title: "מפת עמדות מאושרות",
    desc: "גילוי, תמונות ומידע ציבורי",
    accent: "bg-accent/[0.14]",
  },
  {
    icon: LayoutDashboard,
    title: "לוח בקרה עירוני",
    desc: "ניהול בקשות, סטטוסים והחלטות",
    accent: "bg-info/[0.12]",
  },
  {
    icon: FileText,
    title: "טופס הגשת בקשה",
    desc: "מסלול מובנה וברור לבעל העסק",
    accent: "bg-success/[0.10]",
  },
];

export default function SystemSurfaces() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        background:
          "linear-gradient(180deg, hsl(216 25% 95%) 0%, hsl(216 20% 93%) 50%, hsl(216 25% 95%) 100%)",
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section heading with accent anchor */}
        <div className="text-center mb-10">
          <div className="inline-block mb-3">
            <div className="h-[2px] w-8 mx-auto rounded-full bg-accent/60" />
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
            לכל שלב — מסך ייעודי
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
          {surfaces.map((s, i) => (
            <div
              key={i}
              className="group bg-card rounded-xl border border-border/80 p-5 text-center
                shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]
                hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.09)]
                hover:border-border
                hover:-translate-y-0.5
                transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${s.accent} mb-3.5
                  group-hover:scale-105 transition-all duration-300`}
              >
                <s.icon className="w-[18px] h-[18px] text-primary" />
              </div>
              <p className="text-[13px] font-bold text-foreground mb-1.5">{s.title}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
