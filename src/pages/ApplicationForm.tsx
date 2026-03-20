import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send, ExternalLink, CheckCircle2, FileText, ClipboardList, SendHorizonal } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import ashdodLogo from "@/assets/ashdod-logo.jpeg";

interface FormData {
  truck_name: string;
  food_category: string;
  hours_from: string;
  hours_to: string;
}

const STEPS = [
  { label: "אישור מדיניות", icon: FileText },
  { label: "פרטי העמדה", icon: ClipboardList },
  { label: "סיכום והגשה", icon: SendHorizonal },
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">טוען את טופס הבקשה…</p>
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
    <div className="container mx-auto px-4 py-10 max-w-2xl" dir="rtl">
      <PageNavigation />

      {/* Premium header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/8 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          הגשת בקשה להיתר הצבה
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          תהליך קצר ופשוט — מלאו את הפרטים ונחזור אליכם בהקדם
        </p>
      </div>

      {/* Premium stepper */}
      <div className="flex items-start mb-10 px-2">
        {STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isCompleted = i < step;
          const isCurrent = i === step;
          return (
            <div key={i} className="flex items-start flex-1">
              <div className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[72px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-success text-success-foreground shadow-sm"
                      : isCurrent
                        ? "bg-primary text-primary-foreground ring-[3px] ring-primary/15 shadow-sm"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] text-center leading-tight transition-colors ${
                    isCurrent
                      ? "text-foreground font-semibold"
                      : isCompleted
                        ? "text-success font-medium"
                        : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mt-5 mx-1">
                  <div className={`h-[2px] rounded-full transition-colors ${isCompleted ? "bg-success" : "bg-border"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <Card className="municipal-shadow-lg border-border/60">
        <CardContent className="pt-7 pb-7 px-7 space-y-6">
          {/* Step title */}
          <div className="pb-1">
            <h2 className="text-base font-semibold text-foreground">{STEPS[step].label}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === 0 && "יש לאשר את תנאי המדיניות לפני המשך"}
              {step === 1 && "הזינו את פרטי העמדה — רק שם העמדה הוא שדה חובה"}
              {step === 2 && "בדקו שהפרטים נכונים לפני ההגשה"}
            </p>
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <div className="bg-muted/30 rounded-xl p-6 border border-border/60 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-foreground text-[13px]">
                  עיקרי המדיניות העירונית להצבת עמדות מזון:
                </p>
                <ul className="space-y-2.5 text-muted-foreground text-[13px]">
                  {[
                    "העמדה חייבת להיות ניידת לחלוטין על גלגלים",
                    "עיצוב מינימליסטי — עד 2 גוונים ו-2 חומרים עיקריים",
                    "חיפוי בצבע אפוי בתנור, ללא מדבקות",
                    "הצבה על ריצוף קיים בלבד, ללא עבודות קרקע",
                    "חיבור לנקודות תשתית קיימות ומסומנות בלבד",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-[7px] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/policy"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-primary text-[13px] font-medium hover:underline pt-1"
                >
                  לקריאת המדיניות המלאה
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                  policyAccepted
                    ? "bg-success/5 border-success/30"
                    : "bg-card border-border/80 hover:border-primary/30"
                }`}
                onClick={() => setPolicyAccepted(!policyAccepted)}
              >
                <Checkbox
                  id="policy"
                  checked={policyAccepted}
                  onCheckedChange={(v) => setPolicyAccepted(!!v)}
                  className="mt-0.5"
                />
                <Label htmlFor="policy" className="text-sm leading-relaxed cursor-pointer text-foreground">
                  קראתי את המדיניות ואני מאשר/ת שהעמדה עומדת בדרישות
                </Label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <Field
                label="שם העמדה"
                required
                value={form.truck_name}
                onChange={(v) => update("truck_name", v)}
                placeholder="לדוגמה: הבורגר של ניסים"
              />
              <Field
                label="קטגוריית מזון"
                value={form.food_category}
                onChange={(v) => update("food_category", v)}
                placeholder="לדוגמה: המבורגרים, פיצה, אסיאתי"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="שעת התחלה" value={form.hours_from} onChange={(v) => update("hours_from", v)} type="time" />
                <Field label="שעת סיום" value={form.hours_to} onChange={(v) => update("hours_to", v)} type="time" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-success/5 border border-success/20 rounded-xl p-6 space-y-0">
                <h3 className="font-semibold text-foreground text-[15px] mb-4">סיכום הבקשה</h3>
                <SummaryRow label="שם העמדה" value={form.truck_name} />
                <SummaryRow label="קטגוריית מזון" value={form.food_category} />
                <SummaryRow label="שעות פעילות" value={form.hours_from && form.hours_to ? `${form.hours_from} – ${form.hours_to}` : ""} />
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                לאחר ההגשה, הבקשה תועבר לבדיקת מחלקת הנדסה ותכנון עירוני
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-5 border-t border-border/60">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              הקודם
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                size="default"
                className="min-w-[120px] shadow-sm"
              >
                המשך
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !canNext()}
                size="lg"
                className="min-w-[160px] shadow-sm font-semibold"
              >
                <Send className="h-4 w-4 ml-1.5" />
                {submitting ? "שולח את הבקשה…" : "הגשת הבקשה"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 text-sm border-border/80 focus-visible:ring-primary/30"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-success/10 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
