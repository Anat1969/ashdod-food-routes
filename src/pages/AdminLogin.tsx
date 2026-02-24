import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, LogIn } from "lucide-react";

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError("שם משתמש או סיסמה שגויים");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md municipal-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">כניסת מנהל מערכת</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">מיועד לאדריכל העיר ומורשי גישה בלבד</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">אימייל</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">סיסמה</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4 ml-1" />
              {loading ? "מתחבר..." : "כניסה"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
