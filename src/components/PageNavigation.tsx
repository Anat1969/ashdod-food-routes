import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, ChevronLeft, Undo2 } from "lucide-react";

export default function PageNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="flex items-center gap-2 mb-4" dir="rtl">
      {!isHome && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-1"
        >
          <Link to="/">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">בית</span>
          </Link>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-1"
      >
        <Undo2 className="h-4 w-4" />
        <span className="hidden sm:inline">חזרה</span>
      </Button>

      <div className="flex items-center border rounded-md overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(1)}
          className="rounded-none border-l px-2"
          title="קדימה"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="rounded-none px-2"
          title="אחורה"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
