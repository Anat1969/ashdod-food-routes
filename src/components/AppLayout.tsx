import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import ashdodLogo from "@/assets/ashdod-logo.jpeg";

export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navLinks = [
  { to: "/", label: "ראשי" },
  { to: "/map", label: "מפת עמדות" },
  { to: "/journey", label: "מסלולים" },
  { to: "/policy", label: "מדיניות" },
  { to: "/apply", label: "הגשת בקשה" }];

  if (user && !isAdmin) {
    navLinks.push({ to: "/dashboard", label: "הבקשות שלי" });
  }
  if (isAdmin) {
    navLinks.push({ to: "/directory", label: "מאגר עמדות" });
    navLinks.push({ to: "/admin", label: "לוח בקרה" });
  }
  navLinks.push({ to: "/advertisement", label: "גלו עמדות" });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="premium-hero-luxe text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground/[0.04]">
        <div className="container mx-auto px-4 h-[56px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg overflow-hidden bg-primary-foreground/[0.06] border border-primary-foreground/[0.08] flex items-center justify-center">
              <img alt="סמל עיריית אשדוד" className="h-8 w-8 object-contain" src={ashdodLogo} />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="border-r border-primary-foreground/10 h-4" />
              <span className="text-[11px] font-medium text-primary-foreground/40 tracking-wide">
                עמדות מזון · אשדוד
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-px">
            {navLinks.map((link) =>
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              location.pathname === link.to ?
              "bg-primary-foreground/12 text-primary-foreground shadow-sm" :
              "text-primary-foreground/55 hover:text-primary-foreground/90 hover:bg-primary-foreground/[0.06]"}`
              }>
                {link.label}
              </Link>
            )}

            <div className="border-r border-primary-foreground/10 h-5 mx-2" />

            {user ?
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground/55 hover:text-primary-foreground hover:bg-primary-foreground/[0.08] text-[13px] h-9 px-3">
                <LogOut className="h-3.5 w-3.5 ml-1.5" />
                יציאה
              </Button> :
            <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary-foreground/55 hover:text-primary-foreground hover:bg-primary-foreground/[0.08] text-[13px] h-9 px-3">
                  התחברות
                </Button>
              </Link>
            }
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>

            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen &&
        <nav className="md:hidden border-t border-primary-foreground/10 pb-4">
            {navLinks.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-6 py-3 text-sm font-medium ${
            location.pathname === link.to ? "bg-primary-foreground/15" : "text-primary-foreground/75"}`
            }>

                {link.label}
              </Link>
          )}
            {user ?
          <button onClick={() => {handleSignOut();setMobileMenuOpen(false);}} className="block px-6 py-3 text-sm font-medium w-full text-start text-primary-foreground/75">
                יציאה
              </button> :

          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-sm font-medium text-primary-foreground/75">
                התחברות
              </Link>
          }
          </nav>
        }
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/60 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} עיריית אשדוד — מחלקת הנדסה ותכנון עירוני</p>
          <p className="mt-1 text-xs text-primary-foreground/40">מערכת ניהול עמדות מזון במרחב הציבורי</p>
        </div>
      </footer>
    </div>);

}
