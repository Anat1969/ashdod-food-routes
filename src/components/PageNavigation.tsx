import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home, ChevronRight, ChevronLeft,
  ChevronsRight, ChevronsLeft,
} from "lucide-react";
import { useListNavigation } from "@/hooks/useListNavigation";

interface PageNavigationProps {
  currentItemId?: string;
}

export default function PageNavigation({ currentItemId }: PageNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const {
    hasList, hasPrev, hasNext,
    goToPrev, goToNext, goToList,
    total, position,
  } = useListNavigation(currentItemId);

  return (
    <div className="flex items-center gap-1.5 mb-4 flex-wrap" dir="rtl">
      {/* Home */}
      {!isHome && (
        <NavButton tooltip="דף הבית" asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
          </Link>
        </NavButton>
      )}

      {/* History back/forward */}
      <div className="flex items-center border border-input rounded-md overflow-hidden">
        <NavButton
          tooltip="קדימה"
          onClick={() => navigate(1)}
          className="rounded-none border-l border-input px-2"
          noBorder
        >
          <ChevronLeft className="h-4 w-4" />
        </NavButton>
        <NavButton
          tooltip="אחורה"
          onClick={() => navigate(-1)}
          className="rounded-none px-2"
          noBorder
        >
          <ChevronRight className="h-4 w-4" />
        </NavButton>
      </div>

      {/* Record navigation (prev/next in list) */}
      {hasList && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center border border-input rounded-md overflow-hidden">
            <NavButton
              tooltip="רשומה הבאה"
              onClick={goToNext}
              disabled={!hasNext}
              className="rounded-none border-l border-input px-2"
              noBorder
            >
              <ChevronsLeft className="h-4 w-4" />
            </NavButton>
            <span className="px-2 text-xs text-muted-foreground font-medium min-w-[3rem] text-center tabular-nums">
              {position}/{total}
            </span>
            <NavButton
              tooltip="רשומה קודמת"
              onClick={goToPrev}
              disabled={!hasPrev}
              className="rounded-none px-2"
              noBorder
            >
              <ChevronsRight className="h-4 w-4" />
            </NavButton>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToList}
            className="text-xs gap-1 px-2 h-8 text-muted-foreground"
          >
            חזרה לרשימה
          </Button>
        </>
      )}
    </div>
  );
}

/* ─── NavButton helper ─── */
function NavButton({
  tooltip,
  children,
  onClick,
  disabled,
  className = "",
  noBorder = false,
  asChild = false,
}: {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  noBorder?: boolean;
  asChild?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={noBorder ? "ghost" : "outline"}
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={`h-8 ${className}`}
          asChild={asChild}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
