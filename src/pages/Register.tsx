import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, ShieldCheck, MailCheck } from "lucide-react";
import ashdodLogo from "@/assets/ashdod-logo.jpeg";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setError("שגיאה בהתחברות עם Google");
    }
  };

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10 mb-2">
              <MailCheck className="h-7 w-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              בדקו את תיבת המייל
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              שלחנו מייל אישור לכתובת <strong className="text-foreground">{email}</strong>.
              לחצו על הקישור כדי להפעיל את החשבון.
            </p>
          </div>
          <Card className="municipal-shadow border-border/60">
            <CardContent className="pt-6 pb-6 px-8 text-center">
              <Link to="/login">
                <Button variant="outline" className="h-11 px-8">
                  חזרה לכניסה
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Branding header — original logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/6 border border-border/60 mb-2 overflow-hidden">
            <img src={ashdodLogo} alt="סמל עיריית אשדוד" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            יצירת חשבון חדש
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            עיריית אשדוד · מערכת ניהול עמדות מזון
          </p>
        </div>

        {/* Auth card */}
        <Card className="municipal-shadow border-border/60">
          <CardContent className="pt-8 pb-8 px-8 space-y-6">
            <Button
              variant="outline"
              className="w-full h-11 text-sm font-medium border-border/80 hover:bg-secondary/50 transition-colors"
              onClick={handleGoogle}
            >
              <svg className="h-4 w-4 ml-2 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              הרשמה עם חשבון Google
            </Button>

            <div className="relative">
              <Separator className="bg-border/60" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                או עם אימייל וסיסמה
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">שם מלא</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="השם המלא שלך"
                  className="h-11 text-sm border-border/80 focus-visible:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">אימייל</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="your@email.com"
                  className="h-11 text-sm border-border/80 focus-visible:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">סיסמה</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  minLength={6}
                  placeholder="••••••••"
                  className="h-11 text-sm border-border/80 focus-visible:ring-primary/30"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold shadow-sm"
                disabled={loading}
              >
                <UserPlus className="h-4 w-4 ml-1" />
                {loading ? "נרשם…" : "יצירת חשבון"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              כבר יש לך חשבון?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                כניסה
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Trust footer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>גישה מאובטחת למערכת העירונית</span>
        </div>
      </div>
    </div>
  );
}
