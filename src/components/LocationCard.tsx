import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Droplets, CircleDot } from "lucide-react";
import { toast } from "sonner";
import type { FoodTruck, Location, Profile, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

interface ExpertOpinionData {
  id: string;
  truck_id: string;
  environment_ok: boolean | null;
  structure_ok: boolean | null;
  field_notes: string | null;
  conditions: string | null;
  [key: string]: unknown;
}

interface LocationCardProps {
  truck: FoodTruck;
  location: Location | null;
  operator: Profile | null;
  expertOpinion: ExpertOpinionData | null;
  isAdmin: boolean;
  userId: string | undefined;
  onUpdate: () => void;
}

export default function LocationCard({ truck, location, operator, expertOpinion, isAdmin, userId, onUpdate }: LocationCardProps) {
  const [fieldNotes, setFieldNotes] = useState(expertOpinion?.field_notes || "");
  const [conditions, setConditions] = useState(expertOpinion?.conditions || "");
  const [saving, setSaving] = useState(false);

  const upsertExpertField = async (fields: Record<string, unknown>) => {
    if (!isAdmin) return;
    setSaving(true);
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update(fields).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        ...fields,
      } as any);
    }
    setSaving(false);
    onUpdate();
  };

  const toggleBool = (field: string, current: boolean | null) => {
    upsertExpertField({ [field]: !current });
  };

  const saveTextFields = async () => {
    await upsertExpertField({ field_notes: fieldNotes, conditions });
    toast.success("נשמר בהצלחה");
  };

  const isApproved = truck.status === "approved";

  return (
    <div className="bg-sky-50 rounded-xl p-4 space-y-4 border border-sky-200" dir="rtl">
      {/* Photos row */}
      <div className="grid grid-cols-3 gap-3">
        <PhotoSlot label="תמונת רחוב 1" url={truck.street_photo_1_url} />
        <PhotoSlot label="תמונת רחוב 2" url={truck.street_photo_2_url} />
        <PhotoSlot label="תמונה אווירית" url={truck.aerial_photo_url} />
      </div>

      {/* Main grid: 3 columns */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Right: Location details */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">מיקום</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="שם מיקום" value={location?.name} />
            <Row label="רחוב" value={location?.street} />
            <Row label="שכונה" value={location?.neighborhood} />
            <Row label="גוש" value={location?.gush} />
            <Row label="חלקה" value={location?.chelka} />
            <Row label="אופי מיקום" value={location?.location_type} />
            <Row label="שטח מבנה (מ״ר)" value={location?.building_area_sqm?.toString()} />
            <Row label="שטח סביבה (מ״ר)" value={location?.surrounding_area_sqm?.toString()} />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-muted-foreground">מיקום רצוי:</span>
              {location?.is_desired ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-destructive" />}
            </div>
            <div className="flex gap-4 pt-2 border-t">
              <InfraIcon label="חשמל" ok={location?.infra_electricity} icon={<Zap className="h-4 w-4" />} />
              <InfraIcon label="מים" ok={location?.infra_water} icon={<Droplets className="h-4 w-4" />} />
              <InfraIcon label="ביוב" ok={location?.infra_sewage} icon={<CircleDot className="h-4 w-4" />} />
            </div>
          </CardContent>
        </Card>

        {/* Center: Field status */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">מצב קיים בשטח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <BoolField
              label="מצב סביבה תקין"
              value={expertOpinion?.environment_ok ?? null}
              isAdmin={isAdmin}
              onChange={() => toggleBool("environment_ok", expertOpinion?.environment_ok ?? null)}
            />
            <BoolField
              label="מצב מבנה תקין"
              value={expertOpinion?.structure_ok ?? null}
              isAdmin={isAdmin}
              onChange={() => toggleBool("structure_ok", expertOpinion?.structure_ok ?? null)}
            />
            <div className="pt-2 border-t">
              <p className="text-muted-foreground mb-1">ניתוח מצב קיים</p>
              {isAdmin ? (
                <Textarea value={fieldNotes} onChange={(e) => setFieldNotes(e.target.value)} placeholder="ניתוח מצב השטח..." rows={3} />
              ) : (
                <p className="text-sm">{expertOpinion?.field_notes || "—"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Left: Operator + conditions + approval */}
        <div className="space-y-4">
          <Card className="border-sky-300 bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">המפעיל</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="שם" value={operator?.full_name} />
              <Row label="נייד" value={operator?.phone} />
            </CardContent>
          </Card>

          <Card className="border-sky-300 bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">הערות ותנאים</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {isAdmin ? (
                <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="הערות ותנאים..." rows={3} />
              ) : (
                <p>{expertOpinion?.conditions || "—"}</p>
              )}
            </CardContent>
          </Card>

          {isAdmin && (
            <Button onClick={saveTextFields} disabled={saving} className="w-full">
              {saving ? "שומר..." : "שמור שינויים"}
            </Button>
          )}

          <Card className={`border-2 ${isApproved ? "border-green-500 bg-green-50" : "border-destructive bg-red-50"}`}>
            <CardContent className="py-4 text-center">
              <p className="text-lg font-bold">
                {isApproved ? "✅ מאושר" : `❌ ${STATUS_LABELS[truck.status as TruckStatus] || truck.status}`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

function PhotoSlot({ label, url }: { label: string; url: string | null }) {
  return (
    <div className="space-y-1">
      {url ? (
        <img src={url} alt={label} className="w-full h-36 object-cover rounded-lg border border-sky-200" />
      ) : (
        <div className="w-full h-36 bg-sky-100 rounded-lg border border-sky-200 flex items-center justify-center text-xs text-muted-foreground">{label} — לא הועלה</div>
      )}
    </div>
  );
}

function InfraIcon({ label, ok, icon }: { label: string; ok?: boolean; icon: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-1 ${ok ? "text-green-600" : "text-muted-foreground"}`}>
      {icon}
      <span className="text-xs">{label}</span>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
    </div>
  );
}

function BoolField({ label, value, isAdmin, onChange }: { label: string; value: boolean | null; isAdmin: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <Checkbox checked={!!value} onCheckedChange={onChange} />
      ) : (
        value ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-destructive" />
      )}
      <span>{label}</span>
    </div>
  );
}
