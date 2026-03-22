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
    <section className="container mx-auto px-4 py-20 md:py-24 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16">
        {values.map((v, i) => (
          <div key={i} className="text-center group">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/[0.1] mb-5
              group-hover:bg-accent/[0.16] transition-colors duration-300">
              <v.icon className="w-[18px] h-[18px] text-accent" strokeWidth={1.8} />
            </div>
            <h3 className="text-[14px] font-bold text-foreground mb-2.5 tracking-tight">{v.title}</h3>
            <p className="text-[12.5px] text-muted-foreground/80 leading-[1.75]">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
