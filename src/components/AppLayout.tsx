import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "ראשי" },
    { to: "/policy", label: "מדיניות" },
    { to: "/directory", label: "מאגר פודטראקים" },
    { to: "/apply", label: "הגשת בקשה" },
  ];

  if (isAdmin) {
    navLinks.push({ to: "/admin", label: "לוח בקרה" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground municipal-shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-accent" />
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">עיריית אשדוד</span>
              <span className="text-xs opacity-80 leading-tight">ניהול פודטראקס</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary-foreground/20"
                    : "hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-primary-foreground hover:bg-primary-foreground/10 mr-2"
              >
                <LogOut className="h-4 w-4 ml-1" />
                יציאה
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 mr-2">
                  התחברות
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-primary-foreground/20 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-6 py-3 text-sm font-medium ${
                  location.pathname === link.to ? "bg-primary-foreground/20" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block px-6 py-3 text-sm font-medium w-full text-start">
                יציאה
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-sm font-medium">
                התחברות
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} עיריית אשדוד – מחלקת הנדסה ותכנון עירוני</p>
          <p className="mt-1">מערכת ניהול פודטראקס במרחב הציבורי</p>
        </div>
      </footer>
    </div>
  );
}
