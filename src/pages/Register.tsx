import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";

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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md municipal-shadow text-center">
          <CardHeader>
            <CardTitle className="text-xl">📧 בדקי את המייל שלך לאישור</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">שלחנו לך מייל אישור לכתובת {email}. לחצ/י על הקישור כדי להפעיל את החשבון.</p>
            <Link to="/login">
              <Button variant="outline">חזרה להתחברות</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md municipal-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">הרשמה</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">צור/י חשבון חדש במערכת</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            <svg className="h-4 w-4 ml-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            הרשמה עם Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">או</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">שם מלא</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">אימייל</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">סיסמה</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" minLength={6} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="h-4 w-4 ml-1" />
              {loading ? "נרשם..." : "הרשמה"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            כבר יש לך חשבון?{" "}
            <Link to="/login" className="text-primary hover:underline">התחברות</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
