import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home, ChevronRight, ChevronLeft, Undo2,
  SkipBack, ArrowUp, ChevronsRight, ChevronsLeft,
} from "lucide-react";
import { useListNavigation, useRouteHistory } from "@/hooks/useListNavigation";

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

  const { goToRouteStart, goUpOneLevel } = useRouteHistory();

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

      {/* Back to start of route */}
      {!isHome && (
        <NavButton tooltip="חזרה לתחילת המסלול" onClick={goToRouteStart}>
          <SkipBack className="h-4 w-4" />
        </NavButton>
      )}

      {/* Up one level */}
      {!isHome && (
        <NavButton tooltip="רמה אחת למעלה" onClick={goUpOneLevel}>
          <ArrowUp className="h-4 w-4" />
        </NavButton>
      )}

      {/* Back (history) */}
      <NavButton tooltip="חזרה" onClick={() => navigate(-1)}>
        <Undo2 className="h-4 w-4" />
      </NavButton>

      {/* History forward/backward */}
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
          <div className="w-px h-6 bg-border mx-1" />
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
            <span className="px-2 text-xs text-muted-foreground font-medium min-w-[3rem] text-center">
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

          <NavButton
            tooltip="חזרה לרשימה"
            onClick={goToList}
            variant="outline"
            className="text-xs gap-1 px-2"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">רשימה</span>
          </NavButton>
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
  variant,
}: {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  noBorder?: boolean;
  asChild?: boolean;
  variant?: "outline" | "ghost";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant ?? (noBorder ? "ghost" : "outline")}
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
