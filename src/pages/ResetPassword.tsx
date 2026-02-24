import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md municipal-shadow text-center">
          <CardHeader>
            <CardTitle className="text-xl">📧 נשלח בהצלחה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">שלחנו קישור לאיפוס סיסמה לכתובת {email}</p>
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
          <CardTitle className="text-xl">איפוס סיסמה</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">הכנס/י את כתובת האימייל שלך ונשלח לך קישור לאיפוס</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">אימייל</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="h-4 w-4 ml-1" />
              {loading ? "שולח..." : "שלח קישור לאיפוס"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/login" className="text-primary hover:underline">חזרה להתחברות</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
