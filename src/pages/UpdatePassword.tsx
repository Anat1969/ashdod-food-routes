import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("הסיסמאות לא תואמות");
      return;
    }
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      navigate("/dashboard");
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md municipal-shadow text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">טוען...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md municipal-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">עדכון סיסמה</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">הכנס/י סיסמה חדשה</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">סיסמה חדשה</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" minLength={6} />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">אימות סיסמה</Label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required dir="ltr" minLength={6} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <KeyRound className="h-4 w-4 ml-1" />
              {loading ? "מעדכן..." : "עדכן סיסמה"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
