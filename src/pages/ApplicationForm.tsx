import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send, ExternalLink, CheckCircle2 } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

interface FormData {
  truck_name: string;
  food_category: string;
  hours_from: string;
  hours_to: string;
}

const STEPS = [
  "אישור מדיניות",
  "פרטי העמדה",
  "סיכום והגשה",
];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    truck_name: "",
    food_category: "",
    hours_from: "",
    hours_to: "",
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-muted-foreground">טוען...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/apply" replace />;
  }

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return policyAccepted;
    if (step === 1) return form.truck_name.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("food_trucks").insert({
      truck_name: form.truck_name,
      food_category: form.food_category || null,
      hours_from: form.hours_from || null,
      hours_to: form.hours_to || null,
      operator_id: user.id,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("שגיאה בהגשת הבקשה");
    } else {
      toast.success("הבקשה הוגשה בהצלחה!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
      <PageNavigation />

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">הגשת בקשה להיתר הצבה</h1>
        <p className="text-sm text-muted-foreground">מלאו את הפרטים הנדרשים — התהליך פשוט ומהיר</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-[11px] text-center leading-tight ${
                i <= step ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mt-[-1.25rem] ${i < step ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="municipal-shadow border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 0 && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-5 border text-sm leading-relaxed space-y-3">
                <p className="font-medium text-foreground">לפני הגשת הבקשה, יש לקרוא ולאשר את המדיניות:</p>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                  <li>העמדה חייבת להיות ניידת לחלוטין על גלגלים</li>
                  <li>עיצוב מינימליסטי — עד 2 גוונים ו-2 חומרים עיקריים</li>
                  <li>חיפוי בצבע אפוי בתנור, ללא מדבקות</li>
                  <li>הצבה על ריצוף קיים בלבד, ללא עבודות קרקע</li>
                  <li>חיבור לנקודות תשתית קיימות ומסומנות בלבד</li>
                </ul>
                <Link
                  to="/policy"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-1"
                >
                  לקריאת המדיניות המלאה
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
                <Checkbox
                  id="policy"
                  checked={policyAccepted}
                  onCheckedChange={(v) => setPolicyAccepted(!!v)}
                  className="mt-0.5"
                />
                <Label htmlFor="policy" className="text-sm leading-relaxed cursor-pointer">
                  קראתי את המדיניות וההנחיות ואני מאשר/ת שהעמדה עומדת בכל הדרישות
                </Label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="שם העמדה *" value={form.truck_name} onChange={(v) => update("truck_name", v)} placeholder="לדוגמה: הבורגר של ניסים" />
              <Field label="קטגוריית מזון" value={form.food_category} onChange={(v) => update("food_category", v)} placeholder="לדוגמה: המבורגרים, פיצה, אסיאתי" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="שעת התחלה" value={form.hours_from} onChange={(v) => update("hours_from", v)} type="time" />
                <Field label="שעת סיום" value={form.hours_to} onChange={(v) => update("hours_to", v)} type="time" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-5 space-y-3">
              <h3 className="font-semibold text-foreground">סיכום הבקשה</h3>
              <SummaryRow label="שם העמדה" value={form.truck_name} />
              <SummaryRow label="קטגוריית מזון" value={form.food_category} />
              <SummaryRow label="שעות פעילות" value={form.hours_from && form.hours_to ? `${form.hours_from} – ${form.hours_to}` : ""} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} size="sm">
              <ChevronRight className="h-4 w-4 ml-1" />
              הקודם
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()} size="sm">
                הבא
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting || !canNext()} size="default">
                <Send className="h-4 w-4 ml-1" />
                {submitting ? "שולח..." : "הגשת הבקשה"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm mb-1.5 block">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-success/10 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
