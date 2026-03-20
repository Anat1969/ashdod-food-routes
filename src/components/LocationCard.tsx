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

  // Auto-save helpers
  const saveLocationField = async (fields: Partial<Record<string, unknown>>) => {
    if (!isAdmin) return;
    if (location?.id) {
      await supabase.from("locations").update(fields).eq("id", location.id);
    } else {
      const { data: newLoc } = await supabase.from("locations").insert({
        name: locName || "מיקום חדש",
        ...fields,
      } as any).select("id").single();
      if (newLoc) {
        await supabase.from("food_trucks").update({ location_id: newLoc.id }).eq("id", truck.id);
      }
    }
    onUpdate();
  };

  const saveTruckField = async (fields: Record<string, unknown>) => {
    if (!isAdmin) return;
    await supabase.from("food_trucks").update(fields as any).eq("id", truck.id);
    onUpdate();
  };

  const saveProfileField = async (fields: Record<string, unknown>) => {
    if (!isAdmin || !operator?.id) return;
    await supabase.from("profiles").update(fields).eq("id", operator.id);
    onUpdate();
  };

  const saveExpertField = async (fields: Record<string, unknown>) => {
    if (!isAdmin) return;
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update(fields).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        ...fields,
      } as any);
    }
    onUpdate();
  };

  const setExpertBool = async (field: string, newValue: boolean | null) => {
    if (!isAdmin) return;
    if (expertOpinion?.id) {
      await supabase.from("expert_opinions").update({ [field]: newValue }).eq("id", expertOpinion.id);
    } else {
      await supabase.from("expert_opinions").insert({
        truck_id: truck.id,
        author_id: userId || null,
        [field]: newValue,
      } as any);
    }
    onUpdate();
  };

  const isApproved = truck.status === "approved";

  return (
    <div className="bg-sky-50 rounded-xl p-4 space-y-3 border border-sky-200" dir="rtl">

      {/* === ROW 1: Photos === */}
      <div className="grid grid-cols-3 gap-3">
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
              label="מיקום"
              accept="image/*"
              className="h-full"
            />
          ) : (
            <PhotoSlot label="מיקום" url={truck.street_photo_1_url} className="h-full aspect-square" />
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
              label="סביבה"
              accept="image/*"
              className="h-full"
            />
          ) : (
            <PhotoSlot label="סביבה" url={truck.street_photo_2_url} className="h-full aspect-square" />
          )}
        </div>
        <div className="aspect-square">
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
              label="מבנה"
              accept="image/*"
              className="h-full"
            />
          ) : (
            <PhotoSlot label="מבנה" url={truck.vehicle_photo_url} className="h-full aspect-square" />
          )}
        </div>
      </div>
      {/* === ROW 2: Operator === */}
          <Card className="border-sky-300 bg-white/80 flex-1">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base">מפעיל</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pb-3">
              {isAdmin ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <EditableRow label="שם" value={opName} onChange={setOpName} onBlur={() => saveTruckField({ operator_name: opName || null })} />
                  <EditableRow label="נייד" value={opPhone} onChange={setOpPhone} onBlur={() => saveProfileField({ phone: opPhone || null })} />
                  <EditableRow label="כתובת" value={opAddress} onChange={setOpAddress} onBlur={() => saveTruckField({ operator_address: opAddress || null })} />
                  <EditableRow label="מייל" value={opEmail} onChange={setOpEmail} onBlur={() => saveTruckField({ operator_email: opEmail || null })} />
                  <EditableRow label="שטח מבנה (מ״ר)" value={locBuildingArea} onChange={setLocBuildingArea} onBlur={() => saveLocationField({ building_area_sqm: locBuildingArea ? parseFloat(locBuildingArea) : null })} type="number" />
                  <EditableRow label="שטח סביבה (מ״ר)" value={locSurroundingArea} onChange={setLocSurroundingArea} onBlur={() => saveLocationField({ surrounding_area_sqm: locSurroundingArea ? parseFloat(locSurroundingArea) : null })} type="number" />
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
                <EditableRow label="שם מיקום" value={locName} onChange={setLocName} onBlur={() => saveLocationField({ name: locName || "ללא שם" })} />
                <EditableRow label="רחוב" value={locStreet} onChange={setLocStreet} onBlur={() => saveLocationField({ street: locStreet || null })} />
                <EditableRow label="שכונה" value={locNeighborhood} onChange={setLocNeighborhood} onBlur={() => saveLocationField({ neighborhood: locNeighborhood || null })} />
                <EditableRow label="גוש" value={locGush} onChange={setLocGush} onBlur={() => saveLocationField({ gush: locGush || null })} />
                <EditableRow label="חלקה" value={locChelka} onChange={setLocChelka} onBlur={() => saveLocationField({ chelka: locChelka || null })} />
                <div className="flex flex-wrap gap-4 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locDesired} onCheckedChange={(v) => { setLocDesired(!!v); saveLocationField({ is_desired: !!v }); }} />
                    <span className="text-xs">מיקום רצוי</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locElectricity} onCheckedChange={(v) => { setLocElectricity(!!v); saveLocationField({ infra_electricity: !!v }); }} />
                    <Zap className="h-4 w-4" /><span className="text-xs">חשמל</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locWater} onCheckedChange={(v) => { setLocWater(!!v); saveLocationField({ infra_water: !!v }); }} />
                    <Droplets className="h-4 w-4" /><span className="text-xs">מים</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={locSewage} onCheckedChange={(v) => { setLocSewage(!!v); saveLocationField({ infra_sewage: !!v }); }} />
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
              onChange={(v) => setExpertBool("environment_ok", v)}
            />
            <BoolField
              label="מצב מבנה תקין"
              value={expertOpinion?.structure_ok ?? null}
              isAdmin={isAdmin}
              onChange={(v) => setExpertBool("structure_ok", v)}
            />
            <div className="pt-2 border-t">
              <p className="text-muted-foreground mb-1">ניתוח מצב קיים</p>
              {isAdmin ? (
                <Textarea value={fieldNotes} onChange={(e) => setFieldNotes(e.target.value)} onBlur={() => saveExpertField({ field_notes: fieldNotes })} placeholder="ניתוח מצב השטח..." rows={3} />
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
              <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} onBlur={() => saveExpertField({ conditions })} placeholder="הערות ותנאים..." rows={6} />
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

function EditableRow({ label, value, onChange, onBlur, type = "text" }: { label: string; value: string; onChange: (v: string) => void; onBlur?: () => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} type={type} className="h-8 text-sm" />
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

function BoolField({ label, value, isAdmin, onChange }: { label: string; value: boolean | null; isAdmin: boolean; onChange: (newValue: boolean | null) => void }) {
  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(value === true ? null : true)}
            className={`rounded p-1 transition-colors ${value === true ? "bg-green-100 text-green-700 ring-1 ring-green-400" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(value === false ? null : false)}
            className={`rounded p-1 transition-colors ${value === false ? "bg-red-100 text-destructive ring-1 ring-red-400" : "text-muted-foreground hover:bg-muted"}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        value === true ? <Check className="h-5 w-5 text-green-600" /> : value === false ? <X className="h-5 w-5 text-destructive" /> : <Minus className="h-5 w-5 text-muted-foreground" />
      )}
      <span>{label}</span>
    </div>
  );
}
