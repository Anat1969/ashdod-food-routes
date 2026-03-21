import { Eye, LayoutDashboard, Users } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "שקיפות תהליך",
    text: "כל בקשה, סטטוס והחלטה — במקום אחד",
  },
  {
    icon: LayoutDashboard,
    title: "ניהול עירוני חכם",
    text: "ממשק אחד מאוחד לתכנון, בחינה ואישור",
  },
  {
    icon: Users,
    title: "גישה לכל צד",
    text: "מערכת אחת לעירייה, לעסק ולתושב",
  },
];

export default function ValueStrip() {
  return (
    <section className="container mx-auto px-4 py-14 md:py-18 max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
        {values.map((v, i) => (
          <div key={i} className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 mb-3">
              <v.icon className="w-4.5 h-4.5 text-accent" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground mb-1.5">{v.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
