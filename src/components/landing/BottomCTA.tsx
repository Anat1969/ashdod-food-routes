import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-3xl text-center">
      <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight mb-3">
        רוצים לראות איך המערכת עובדת בפועל?
      </h2>
      <div className="flex justify-center mb-8">
        <div className="h-[2px] w-8 rounded-full" style={{ background: "hsl(39 75% 55% / 0.3)" }} />
      </div>

      <Link
        to="/journey"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-bold
          shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]
          transition-all duration-200"
      >
        צפו במסלולים
        <ChevronLeft className="w-4 h-4" />
      </Link>
    </section>
  );
}
