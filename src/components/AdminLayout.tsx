import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "לוח בקרה", icon: BarChart3, end: true },
  { to: "/admin/add", label: "הוספת עמדות", icon: PlusCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-64px)]" dir="rtl">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 right-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-l w-56 shrink-0 p-5 space-y-1 transition-transform duration-200 z-40",
          "md:relative md:translate-x-0",
          open ? "fixed inset-y-0 right-0 top-16 translate-x-0 shadow-lg" : "fixed -translate-x-full md:translate-x-0 md:relative"
        )}
      >
        <p className="text-xs font-medium text-muted-foreground mb-4 px-2 tracking-wide">ניהול</p>
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
