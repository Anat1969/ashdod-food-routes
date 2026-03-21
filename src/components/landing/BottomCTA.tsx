import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="container mx-auto px-4 py-14 md:py-18 max-w-3xl text-center">
      <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight mb-2">
        רוצים לראות איך המערכת עובדת בפועל?
      </h2>
      <div className="flex justify-center mb-6">
        <div className="h-[2px] w-8 rounded-full mt-3" style={{ background: "hsl(39 75% 55% / 0.35)" }} />
      </div>

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
          className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-primary-foreground
            border border-primary/80 text-sm font-medium
            hover:bg-primary/90 transition-all duration-200"
        >
          מפת עמדות מאושרות
        </Link>
      </div>
    </section>
  );
}
