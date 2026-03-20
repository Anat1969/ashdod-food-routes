import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Droplets, CircleDot, Mail, Minus } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ImageLightbox from "@/components/ImageLightbox";

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

  const [opName, setOpName] = useState((truck as any).operator_name || "");
  const [opPhone, setOpPhone] = useState(operator?.phone || "");
  const [opEmail, setOpEmail] = useState((truck as any).operator_email || "");
  const [opAddress, setOpAddress] = useState((truck as any).operator_address || "");

  const [saving, setSaving] = useState(false);

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
    setOpName((truck as any).operator_name || "");
    setOpPhone(operator?.phone || "");
    setOpEmail((truck as any).operator_email || "");
    setOpAddress((truck as any).operator_address || "");
  }, [operator, (truck as any).operator_name, (truck as any).operator_email, (truck as any).operator_address]);

  const saveAll = async () => {
    if (!isAdmin) return;
    setSaving(true);

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

    await supabase.from("food_trucks").update({
      operator_name: opName || null,
      operator_email: opEmail || null,
      operator_address: opAddress || null,
    } as any).eq("id", truck.id);

    if (operator?.id) {
      await supabase.from("profiles").update({
        phone: opPhone || null,
      }).eq("id", operator.id);
    }

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
    const nextValue = current === null ? true : current === true ? false : null;
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update({ [field]: nextValue }).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        [field]: nextValue,
      } as any);
    }
    onUpdate();
  };

  const isApproved = truck.status === "approved";

  return (
    <div className="bg-sky-50 rounded-xl p-4 space-y-3 border border-sky-200" dir="rtl">

      {/* === ROW 1: Photos + Operator === */}
      {/* Right: 2 stacked squares | Left: truck photo (3:2) + מפעיל underneath, aligned bottom */}
      <div className="flex gap-3">
        {/* Right side: two stacked square photos */}
        <div className="flex flex-col gap-3 w-1/3 flex-shrink-0">
          <div className="aspect-square">
            {isAdmin ? (
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
                className="h-full"
              />
            ) : (
              <PhotoSlot label="מיקום עירוני" url={truck.street_photo_1_url} className="h-full aspect-square" />
            )}
          </div>
          <div className="aspect-square">
            {isAdmin ? (
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
                className="h-full"
              />
            ) : (
              <PhotoSlot label="מיקום סביבה" url={truck.street_photo_2_url} className="h-full aspect-square" />
            )}
          </div>
        </div>
        {/* Left side (in RTL): truck photo + מפעיל stacked */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Truck photo - classic 3:2 rectangle */}
          <div className="aspect-[3/2]">
            {isAdmin ? (
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
                className="h-full"
              />
            ) : (
              <PhotoSlot label="הפודטראק" url={truck.vehicle_photo_url} className="h-full" />
            )}
          </div>
          {/* מפעיל - fills remaining space */}
          <Card className="border-sky-300 bg-white/80 flex-1">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base">מפעיל</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pb-3">
              {isAdmin ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <EditableRow label="שם" value={opName} onChange={setOpName} />
                  <EditableRow label="נייד" value={opPhone} onChange={setOpPhone} />
                  <EditableRow label="כתובת" value={opAddress} onChange={setOpAddress} />
                  <EditableRow label="מייל" value={opEmail} onChange={setOpEmail} />
                  <EditableRow label="שטח מבנה (מ״ר)" value={locBuildingArea} onChange={setLocBuildingArea} type="number" />
                  <EditableRow label="שטח סביבה (מ״ר)" value={locSurroundingArea} onChange={setLocSurroundingArea} type="number" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  <ReadOnlyRow label="שם" value={(truck as any).operator_name} />
                  <ReadOnlyRow label="נייד" value={operator?.phone} />
                  <ReadOnlyRow label="כתובת" value={(truck as any).operator_address} />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">מייל:</span>
                    {(truck as any).operator_email ? (
                      <a href={`mailto:${(truck as any).operator_email}`} className="font-medium text-primary flex items-center gap-1 hover:underline">
                        <Mail className="h-3 w-3" />
                        {(truck as any).operator_email}
                      </a>
                    ) : (
                      <span className="font-medium">—</span>
                    )}
                  </div>
                  <ReadOnlyRow label="שטח מבנה (מ״ר)" value={location?.building_area_sqm?.toString()} />
                  <ReadOnlyRow label="שטח סביבה (מ״ר)" value={location?.surrounding_area_sqm?.toString()} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* === ROW 3: מיקום | מצב בשטח | הערות ותנאים === */}
      <div className="grid grid-cols-3 gap-3">
        {/* מיקום (right in RTL) */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">מיקום</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm pb-3">
            {isAdmin ? (
              <>
                <EditableRow label="שם מיקום" value={locName} onChange={setLocName} />
                <EditableRow label="רחוב" value={locStreet} onChange={setLocStreet} />
                <EditableRow label="שכונה" value={locNeighborhood} onChange={setLocNeighborhood} />
                <EditableRow label="גוש" value={locGush} onChange={setLocGush} />
                <EditableRow label="חלקה" value={locChelka} onChange={setLocChelka} />
                <div className="flex flex-wrap gap-4 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locDesired} onCheckedChange={(v) => setLocDesired(!!v)} />
                    <span className="text-xs">מיקום רצוי</span>
                  </div>
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

        {/* מצב בשטח (center) */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">מצב בשטח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm pb-3">
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

        {/* הערות ותנאים (left in RTL) */}
        <Card className="border-sky-300 bg-white/80">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base">הערות ותנאים</CardTitle>
          </CardHeader>
          <CardContent className="text-sm pb-3">
            {isAdmin ? (
              <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="הערות ותנאים..." rows={6} />
            ) : (
              <p>{expertOpinion?.conditions || "—"}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === ROW 4: סטטוס + שמור שינויים === */}
      <div className="grid grid-cols-3 gap-3">
        {isAdmin ? (
          <Button onClick={saveAll} disabled={saving} className="h-full text-lg font-bold">
            {saving ? "שומר..." : "שמור שינויים"}
          </Button>
        ) : (
          <div />
        )}

        <Card className={`col-span-2 border-2 ${isApproved ? "border-green-500 bg-green-50" : "border-destructive bg-red-50"}`}>
          <CardContent className="py-3 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">סטטוס</p>
            <p className="text-lg font-bold">
              {isApproved ? "✅ מאושר" : `❌ ${STATUS_LABELS[truck.status as TruckStatus] || truck.status}`}
            </p>
          </CardContent>
        </Card>
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

function PhotoSlot({ label, url, className = "" }: { label: string; url: string | null; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs text-center font-medium text-muted-foreground">{label}</p>
      {url ? (
        <ImageLightbox src={url} alt={label}>
          {({ onClick }) => (
            <img src={url} alt={label} className="w-full h-full object-cover rounded-lg border border-sky-200 cursor-zoom-in" onClick={onClick} />
          )}
        </ImageLightbox>
      ) : (
        <div className="w-full h-full min-h-[80px] bg-sky-100 rounded-lg border border-sky-200 flex items-center justify-center text-xs text-muted-foreground">{label} — לא הועלה</div>
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
        <Checkbox
          checked={value === true ? true : value === false ? "indeterminate" : false}
          onCheckedChange={onChange}
          className={value === false ? "border-destructive bg-destructive text-destructive-foreground" : ""}
        />
      ) : (
        value === true ? <Check className="h-5 w-5 text-green-600" /> : value === false ? <X className="h-5 w-5 text-destructive" /> : <Minus className="h-5 w-5 text-muted-foreground" />
      )}
      <span>{label}</span>
    </div>
  );
}
