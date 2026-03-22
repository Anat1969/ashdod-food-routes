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
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-14">
        {values.map((v, i) => (
          <div key={i} className="text-center group">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/[0.08] mb-4
              group-hover:bg-accent/[0.14] transition-colors duration-300">
              <v.icon className="w-[18px] h-[18px] text-accent" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground mb-2 tracking-tight">{v.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-[1.7]">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
