import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NEIGHBORHOODS } from "@/lib/types";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send, ExternalLink } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

interface FormData {
  truck_name: string;
  vehicle_type: string;
  food_category: string;
  hours_from: string;
  hours_to: string;
}

const STEPS = [
  "אישור מדיניות",
  "פרטי הרכב",
  "סיכום ואישור",
];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    truck_name: "",
    vehicle_type: "",
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
    if (step === 1) return form.truck_name && form.vehicle_type;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("food_trucks").insert({
      truck_name: form.truck_name,
      vehicle_type: form.vehicle_type || null,
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
      <h1 className="text-2xl font-bold mb-2">הגשת בקשה להעמדת פודטראק</h1>
      <p className="text-muted-foreground mb-6">מלא את הפרטים הבאים להגשת בקשה חדשה</p>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <Card className="municipal-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 border text-sm leading-relaxed space-y-2">
                <p className="font-medium">לפני הגשת הבקשה, עליך לקרוא ולאשר את המדיניות:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>הפודטראק חייב להיות נייד לחלוטין על גלגלים</li>
                  <li>עיצוב מינימליסטי — עד 2 גוונים ו-2 חומרים עיקריים</li>
                  <li>חיפוי בצבע אפוי בתנור, ללא מדבקות זולות</li>
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
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-background">
                <Checkbox
                  id="policy"
                  checked={policyAccepted}
                  onCheckedChange={(v) => setPolicyAccepted(!!v)}
                  className="mt-0.5"
                />
                <Label htmlFor="policy" className="text-sm leading-relaxed cursor-pointer">
                  קראתי את המדיניות וההנחיות ואני מאשר/ת שהפודטראק שלי עומד בכל הדרישות
                </Label>
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              <Field label="שם הפודטראק *" value={form.truck_name} onChange={(v) => update("truck_name", v)} />
              <div>
                <Label className="text-sm mb-1.5 block">סוג רכב *</Label>
                <Select value={form.vehicle_type} onValueChange={(v) => update("vehicle_type", v)}>
                  <SelectTrigger><SelectValue placeholder="בחר סוג" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">משאית</SelectItem>
                    <SelectItem value="caravan">קרוואן</SelectItem>
                    <SelectItem value="stand">דוכן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="קטגוריית מזון" value={form.food_category} onChange={(v) => update("food_category", v)} placeholder="לדוגמה: המבורגרים, פיצה" />
              <Field label="שעת התחלה" value={form.hours_from} onChange={(v) => update("hours_from", v)} type="time" />
              <Field label="שעת סיום" value={form.hours_to} onChange={(v) => update("hours_to", v)} type="time" />
            </>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h3 className="font-semibold">סיכום הבקשה</h3>
              <SummaryRow label="שם הפודטראק" value={form.truck_name} />
              <SummaryRow label="סוג רכב" value={form.vehicle_type} />
              <SummaryRow label="קטגוריית מזון" value={form.food_category} />
              <SummaryRow label="שעות" value={form.hours_from && form.hours_to ? `${form.hours_from} - ${form.hours_to}` : ""} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ChevronRight className="h-4 w-4 ml-1" />
              הקודם
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                הבא
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting || !canNext()}>
                <Send className="h-4 w-4 ml-1" />
                {submitting ? "שולח..." : "הגש בקשה"}
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
    <div className="flex items-center justify-between py-1.5 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
