import { Truck, ShieldCheck, UtensilsCrossed, ArrowLeft } from "lucide-react";

const roles = [
  {
    icon: Truck,
    label: "בעל עסק",
    desc: "מגיש בקשות ועוקב אחרי סטטוס",
    accentHsl: "39 75% 55%",
  },
  {
    icon: ShieldCheck,
    label: "עירייה",
    desc: "בוחנת, מאשרת ומנהלת מדיניות",
    accentHsl: "216 59% 26%",
  },
  {
    icon: UtensilsCrossed,
    label: "תושב",
    desc: "צופה בעמדות מאושרות ובמידע ציבורי",
    accentHsl: "195 60% 46%",
  },
];

export default function EqualityFlow() {
  return (
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-14 md:py-18 max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            מערכת אחת. שלושה עולמות. שפה אחת.
          </h2>
        </div>
        <p className="text-[13px] md:text-[14px] text-muted-foreground text-center leading-relaxed max-w-xl mx-auto mb-10">
          העירייה מנהלת ובוחנת, העסק מגיש ועוקב, והתושב מגלה עמדות מאושרות —
          דרך מערכת אחת רציפה וברורה.
        </p>

        {/* Flow */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-0">
              {/* Role unit */}
              <div className="flex flex-col items-center text-center w-36 md:w-44">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5"
                  style={{ background: `hsl(${role.accentHsl} / 0.1)` }}
                >
                  <role.icon className="w-5 h-5" style={{ color: `hsl(${role.accentHsl})` }} />
                </div>
                <p className="text-sm font-bold text-foreground mb-1">{role.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{role.desc}</p>
              </div>

              {/* Arrow connector */}
              {i < roles.length - 1 && (
                <div className="hidden sm:flex items-center px-3 text-muted-foreground/25">
                  <ArrowLeft className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
