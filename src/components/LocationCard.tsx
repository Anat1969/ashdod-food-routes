import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Droplets, CircleDot } from "lucide-react";
import FileUpload from "@/components/FileUpload";

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
  // Expert opinion fields
  const [fieldNotes, setFieldNotes] = useState(expertOpinion?.field_notes || "");
  const [conditions, setConditions] = useState(expertOpinion?.conditions || "");

  // Editable location fields
  const [locName, setLocName] = useState(location?.name || "");
  const [locStreet, setLocStreet] = useState(location?.street || "");
  const [locNeighborhood, setLocNeighborhood] = useState(location?.neighborhood || "");
  const [locGush, setLocGush] = useState(location?.gush || "");
  const [locChelka, setLocChelka] = useState(location?.chelka || "");
  const [locType, setLocType] = useState(location?.location_type || "");
  const [locBuildingArea, setLocBuildingArea] = useState(location?.building_area_sqm?.toString() || "");
  const [locSurroundingArea, setLocSurroundingArea] = useState(location?.surrounding_area_sqm?.toString() || "");
  const [locDesired, setLocDesired] = useState(location?.is_desired ?? false);
  const [locElectricity, setLocElectricity] = useState(location?.infra_electricity ?? false);
  const [locWater, setLocWater] = useState(location?.infra_water ?? false);
  const [locSewage, setLocSewage] = useState(location?.infra_sewage ?? false);

  // Editable operator fields
  const [opName, setOpName] = useState(operator?.full_name || "");
  const [opPhone, setOpPhone] = useState(operator?.phone || "");

  const [saving, setSaving] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setFieldNotes(expertOpinion?.field_notes || "");
    setConditions(expertOpinion?.conditions || "");
  }, [expertOpinion]);

  useEffect(() => {
    setLocName(location?.name || "");
    setLocStreet(location?.street || "");
    setLocNeighborhood(location?.neighborhood || "");
    setLocGush(location?.gush || "");
    setLocChelka(location?.chelka || "");
    setLocType(location?.location_type || "");
    setLocBuildingArea(location?.building_area_sqm?.toString() || "");
    setLocSurroundingArea(location?.surrounding_area_sqm?.toString() || "");
    setLocDesired(location?.is_desired ?? false);
    setLocElectricity(location?.infra_electricity ?? false);
    setLocWater(location?.infra_water ?? false);
    setLocSewage(location?.infra_sewage ?? false);
  }, [location]);

  useEffect(() => {
    setOpName(operator?.full_name || "");
    setOpPhone(operator?.phone || "");
  }, [operator]);

  const saveAll = async () => {
    if (!isAdmin) return;
    setSaving(true);

    // Save location (upsert)
    if (location?.id) {
      await supabase.from("locations").update({
        name: locName || "ללא שם",
        street: locStreet || null,
        neighborhood: locNeighborhood || null,
        gush: locGush || null,
        chelka: locChelka || null,
        location_type: locType || null,
        building_area_sqm: locBuildingArea ? parseFloat(locBuildingArea) : null,
        surrounding_area_sqm: locSurroundingArea ? parseFloat(locSurroundingArea) : null,
        is_desired: locDesired,
        infra_electricity: locElectricity,
        infra_water: locWater,
        infra_sewage: locSewage,
      }).eq("id", location.id);
    } else {
      // Create new location and link to truck
      const { data: newLoc } = await supabase.from("locations").insert({
        name: locName || "מיקום חדש",
        street: locStreet || null,
        neighborhood: locNeighborhood || null,
        gush: locGush || null,
        chelka: locChelka || null,
        location_type: locType || null,
        building_area_sqm: locBuildingArea ? parseFloat(locBuildingArea) : null,
        surrounding_area_sqm: locSurroundingArea ? parseFloat(locSurroundingArea) : null,
        is_desired: locDesired,
        infra_electricity: locElectricity,
        infra_water: locWater,
        infra_sewage: locSewage,
      }).select("id").single();
      if (newLoc) {
        await supabase.from("food_trucks").update({ location_id: newLoc.id }).eq("id", truck.id);
      }
    }

    // Save operator profile
    if (operator?.id) {
      await supabase.from("profiles").update({
        full_name: opName || null,
        phone: opPhone || null,
      }).eq("id", operator.id);
    }

    // Save expert opinion
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update({ field_notes: fieldNotes, conditions }).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        field_notes: fieldNotes,
        conditions,
      } as any);
    }

    setSaving(false);
    toast.success("כרטיס המיקום נשמר בהצלחה");
    onUpdate();
  };

  const toggleExpertBool = async (field: string, current: boolean | null) => {
    if (!isAdmin) return;
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update({ [field]: !current }).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        [field]: true,
      } as any);
    }
    onUpdate();
  };

  const isApproved = truck.status === "approved";

  return (
    <div className="bg-sky-50 rounded-xl p-4 space-y-4 border border-sky-200" dir="rtl">
      {/* Photos row */}
      <div className="grid grid-cols-3 gap-3">
        {isAdmin ? (
          <>
            <FileUpload
              bucket="truck-photos"
              storagePath={`${truck.id}/street1`}
              currentUrl={truck.street_photo_1_url}
              onUploaded={async (url) => {
                await supabase.from("food_trucks").update({ street_photo_1_url: url }).eq("id", truck.id);
                onUpdate();
              }}
              onDeleted={async () => {
                await supabase.from("food_trucks").update({ street_photo_1_url: null }).eq("id", truck.id);
                onUpdate();
              }}
              label="מיקום עירוני"
              accept="image/*"
            />
            <FileUpload
              bucket="truck-photos"
              storagePath={`${truck.id}/street2`}
              currentUrl={truck.street_photo_2_url}
              onUploaded={async (url) => {
                await supabase.from("food_trucks").update({ street_photo_2_url: url }).eq("id", truck.id);
                onUpdate();
              }}
              onDeleted={async () => {
                await supabase.from("food_trucks").update({ street_photo_2_url: null }).eq("id", truck.id);
                onUpdate();
              }}
              label="מיקום סביבה"
              accept="image/*"
            />
            <FileUpload
              bucket="truck-photos"
              storagePath={`${truck.id}/vehicle`}
              currentUrl={truck.vehicle_photo_url}
              onUploaded={async (url) => {
                await supabase.from("food_trucks").update({ vehicle_photo_url: url }).eq("id", truck.id);
                onUpdate();
              }}
              onDeleted={async () => {
                await supabase.from("food_trucks").update({ vehicle_photo_url: null }).eq("id", truck.id);
                onUpdate();
              }}
              label="הפודטראק"
              accept="image/*"
            />
          </>
        ) : (
          <>
            <PhotoSlot label="מיקום עירוני" url={truck.street_photo_1_url} />
            <PhotoSlot label="מיקום סביבה" url={truck.street_photo_2_url} />
            <PhotoSlot label="הפודטראק" url={truck.vehicle_photo_url} />
          </>
        )}
      </div>

      {/* Main grid: 3 columns */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Right: Location details */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">מיקום</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {isAdmin ? (
              <>
                <EditableRow label="שם מיקום" value={locName} onChange={setLocName} />
                <EditableRow label="רחוב" value={locStreet} onChange={setLocStreet} />
                <EditableRow label="שכונה" value={locNeighborhood} onChange={setLocNeighborhood} />
                <EditableRow label="גוש" value={locGush} onChange={setLocGush} />
                <EditableRow label="חלקה" value={locChelka} onChange={setLocChelka} />
                <EditableRow label="אופי מיקום" value={locType} onChange={setLocType} />
                <EditableRow label="שטח מבנה (מ״ר)" value={locBuildingArea} onChange={setLocBuildingArea} type="number" />
                <EditableRow label="שטח סביבה (מ״ר)" value={locSurroundingArea} onChange={setLocSurroundingArea} type="number" />
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox checked={locDesired} onCheckedChange={(v) => setLocDesired(!!v)} />
                  <span>מיקום רצוי</span>
                </div>
                <div className="flex gap-4 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locElectricity} onCheckedChange={(v) => setLocElectricity(!!v)} />
                    <Zap className="h-4 w-4" /><span className="text-xs">חשמל</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locWater} onCheckedChange={(v) => setLocWater(!!v)} />
                    <Droplets className="h-4 w-4" /><span className="text-xs">מים</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locSewage} onCheckedChange={(v) => setLocSewage(!!v)} />
                    <CircleDot className="h-4 w-4" /><span className="text-xs">ביוב</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ReadOnlyRow label="שם מיקום" value={location?.name} />
                <ReadOnlyRow label="רחוב" value={location?.street} />
                <ReadOnlyRow label="שכונה" value={location?.neighborhood} />
                <ReadOnlyRow label="גוש" value={location?.gush} />
                <ReadOnlyRow label="חלקה" value={location?.chelka} />
                <ReadOnlyRow label="אופי מיקום" value={location?.location_type} />
                <ReadOnlyRow label="שטח מבנה (מ״ר)" value={location?.building_area_sqm?.toString()} />
                <ReadOnlyRow label="שטח סביבה (מ״ר)" value={location?.surrounding_area_sqm?.toString()} />
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-muted-foreground">מיקום רצוי:</span>
                  {location?.is_desired ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-destructive" />}
                </div>
                <div className="flex gap-4 pt-2 border-t">
                  <InfraIcon label="חשמל" ok={location?.infra_electricity} icon={<Zap className="h-4 w-4" />} />
                  <InfraIcon label="מים" ok={location?.infra_water} icon={<Droplets className="h-4 w-4" />} />
                  <InfraIcon label="ביוב" ok={location?.infra_sewage} icon={<CircleDot className="h-4 w-4" />} />
                </div>
              </>
            )}
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
              onChange={() => toggleExpertBool("environment_ok", expertOpinion?.environment_ok ?? null)}
            />
            <BoolField
              label="מצב מבנה תקין"
              value={expertOpinion?.structure_ok ?? null}
              isAdmin={isAdmin}
              onChange={() => toggleExpertBool("structure_ok", expertOpinion?.structure_ok ?? null)}
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
              <CardTitle className="text-base">שם המפעיל</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {isAdmin ? (
                <>
                  <EditableRow label="שם" value={opName} onChange={setOpName} />
                  <EditableRow label="נייד" value={opPhone} onChange={setOpPhone} />
                </>
              ) : (
                <>
                  <ReadOnlyRow label="שם" value={operator?.full_name} />
                  <ReadOnlyRow label="נייד" value={operator?.phone} />
                </>
              )}
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
            <Button onClick={saveAll} disabled={saving} className="w-full">
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

function EditableRow({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="h-8 text-sm" />
    </div>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string | null | undefined }) {
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
