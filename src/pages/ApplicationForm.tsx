import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NEIGHBORHOODS } from "@/lib/types";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

interface FormData {
  applicant_name: string;
  applicant_id: string;
  applicant_phone: string;
  applicant_email: string;
  vehicle_type: string;
  vehicle_dimensions: string;
  food_category: string;
  operating_hours: string;
  requested_street: string;
  requested_neighborhood: string;
}

const STEPS = [
  "פרטי מגיש",
  "פרטי הרכב",
  "מיקום מבוקש",
  "סיכום ואישור",
];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    applicant_name: "",
    applicant_id: "",
    applicant_phone: "",
    applicant_email: "",
    vehicle_type: "",
    vehicle_dimensions: "",
    food_category: "",
    operating_hours: "",
    requested_street: "",
    requested_neighborhood: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return form.applicant_name && form.applicant_id && form.applicant_phone;
    if (step === 1) return form.vehicle_type && form.food_category;
    if (step === 2) return form.requested_street && form.requested_neighborhood;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      applicant_name: form.applicant_name,
      applicant_id: form.applicant_id,
      applicant_phone: form.applicant_phone,
      applicant_email: form.applicant_email || null,
      vehicle_type: form.vehicle_type || null,
      vehicle_dimensions: form.vehicle_dimensions || null,
      food_category: form.food_category || null,
      operating_hours: form.operating_hours || null,
      requested_street: form.requested_street || null,
      requested_neighborhood: form.requested_neighborhood || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("שגיאה בהגשת הבקשה");
    } else {
      toast.success("הבקשה הוגשה בהצלחה!");
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">הגשת בקשה להעמדת פודטראק</h1>
      <p className="text-muted-foreground mb-6">מלא את הפרטים הבאים להגשת בקשה חדשה</p>

      {/* Step indicator */}
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
            <>
              <Field label="שם מלא *" value={form.applicant_name} onChange={(v) => update("applicant_name", v)} />
              <Field label="תעודת זהות *" value={form.applicant_id} onChange={(v) => update("applicant_id", v)} />
              <Field label="טלפון *" value={form.applicant_phone} onChange={(v) => update("applicant_phone", v)} type="tel" />
              <Field label="אימייל" value={form.applicant_email} onChange={(v) => update("applicant_email", v)} type="email" />
            </>
          )}

          {step === 1 && (
            <>
              <Field label="סוג רכב *" value={form.vehicle_type} onChange={(v) => update("vehicle_type", v)} placeholder="לדוגמה: משאית, קרוואן, נגרר" />
              <Field label="מידות הרכב" value={form.vehicle_dimensions} onChange={(v) => update("vehicle_dimensions", v)} placeholder="אורך x רוחב x גובה" />
              <Field label="קטגוריית מזון *" value={form.food_category} onChange={(v) => update("food_category", v)} placeholder="לדוגמה: המבורגרים, פיצה, אסיאתי" />
              <Field label="שעות פעילות מבוקשות" value={form.operating_hours} onChange={(v) => update("operating_hours", v)} placeholder="לדוגמה: 10:00-22:00" />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="כתובת מבוקשת *" value={form.requested_street} onChange={(v) => update("requested_street", v)} />
              <div>
                <Label className="text-sm mb-1.5 block">שכונה *</Label>
                <Select value={form.requested_neighborhood} onValueChange={(v) => update("requested_neighborhood", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר שכונה" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEIGHBORHOODS.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold">סיכום הבקשה</h3>
              <SummaryRow label="שם" value={form.applicant_name} />
              <SummaryRow label="ת.ז." value={form.applicant_id} />
              <SummaryRow label="טלפון" value={form.applicant_phone} />
              <SummaryRow label="אימייל" value={form.applicant_email} />
              <SummaryRow label="סוג רכב" value={form.vehicle_type} />
              <SummaryRow label="מידות" value={form.vehicle_dimensions} />
              <SummaryRow label="קטגוריית מזון" value={form.food_category} />
              <SummaryRow label="שעות פעילות" value={form.operating_hours} />
              <SummaryRow label="כתובת" value={form.requested_street} />
              <SummaryRow label="שכונה" value={form.requested_neighborhood} />
            </div>
          )}

          {/* Navigation */}
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
              <Button onClick={handleSubmit} disabled={submitting}>
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
