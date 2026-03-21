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
    <section className="container mx-auto px-4 py-14 md:py-18 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
          לכל שלב — מסך ייעודי
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
        {surfaces.map((s, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border municipal-shadow p-5 text-center
              hover:municipal-shadow-lg transition-shadow duration-200"
          >
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/[0.07] mb-3">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[13px] font-bold text-foreground mb-1">{s.title}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
