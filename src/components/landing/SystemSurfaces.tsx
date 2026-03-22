import { Map, MapPin, LayoutDashboard, FileText } from "lucide-react";

const surfaces = [
  {
    icon: Map,
    title: "מפת כל הפודטראקים",
    desc: "איתור מהיר של כל המיקומים",
  },
  {
    icon: MapPin,
    title: "מפת עמדות מאושרות",
    desc: "גילוי, תמונות ומידע ציבורי",
  },
  {
    icon: LayoutDashboard,
    title: "לוח בקרה עירוני",
    desc: "ניהול בקשות, סטטוסים והחלטות",
  },
  {
    icon: FileText,
    title: "טופס הגשת בקשה",
    desc: "מסלול מובנה וברור לבעל העסק",
  },
];

export default function SystemSurfaces() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
          לכל שלב — מסך ייעודי
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
        {surfaces.map((s, i) => (
          <div
            key={i}
            className="group bg-card rounded-xl border border-border/60 p-5 text-center
              shadow-sm hover:shadow-md hover:border-border
              transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/[0.06] mb-3.5
              group-hover:bg-primary/[0.1] transition-colors duration-300">
              <s.icon className="w-[18px] h-[18px] text-primary" />
            </div>
            <p className="text-[13px] font-bold text-foreground mb-1.5">{s.title}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
