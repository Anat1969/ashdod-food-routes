import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import FileUpload from "@/components/FileUpload";
import { COMPLIANCE_ITEMS } from "@/lib/types";
import type { FoodTruck, TruckStatus, ComplianceChecklist, ActivityLog } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { Clock, MapPin, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TruckProfile() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user } = useAuth();
  const [truck, setTruck] = useState<FoodTruck | null>(null);
  const [compliance, setCompliance] = useState<ComplianceChecklist | null>(null);
  const [history, setHistory] = useState<ActivityLog[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if current user is the owner of this truck
  const isOwner = truck?.operator_id === user?.id;
  const canUpload = isOwner || isAdmin;

  const fetchData = async () => {
    if (!id) return;
    const [truckRes, complianceRes, historyRes] = await Promise.all([
      supabase.from("food_trucks").select("*").eq("id", id).single(),
      supabase.from("compliance_checklist").select("*").eq("truck_id", id).maybeSingle(),
      supabase.from("activity_log").select("*").eq("truck_id", id).order("created_at", { ascending: false }),
    ]);
    setTruck(truckRes.data);
    setCompliance(complianceRes.data);
    setHistory(historyRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateStatus = async (newStatus: TruckStatus) => {
    if (!truck || !isAdmin) return;
    const oldStatus = truck.status;
    await supabase.from("food_trucks").update({ status: newStatus }).eq("id", truck.id);
    await supabase.from("activity_log").insert({
      truck_id: truck.id,
      user_id: user?.id || null,
      action: "status_change",
      old_status: oldStatus,
      new_status: newStatus,
    });

    // Send email notification to operator
    supabase.functions.invoke("notify-status-change", {
      body: { truck_id: truck.id, old_status: oldStatus, new_status: newStatus },
    }).then(({ error }) => {
      if (error) console.error("Email notification failed:", error);
    });

    toast.success("הסטטוס עודכן בהצלחה");
    fetchData();
  };

  const toggleCompliance = async (field: string, currentValue: boolean | null) => {
    if (!truck || !isAdmin) return;
    if (compliance) {
      await supabase.from("compliance_checklist").update({ [field]: !currentValue }).eq("id", compliance.id);
    } else {
      await supabase.from("compliance_checklist").insert({
        truck_id: truck.id,
        checked_by: user?.id || null,
        [field]: true,
      });
    }
    fetchData();
  };

  const addNote = async () => {
    if (!truck || !newNote.trim() || !isAdmin) return;
    await supabase.from("activity_log").insert({
      truck_id: truck.id,
      user_id: user?.id || null,
      action: "note",
      note: newNote.trim(),
    });
    setNewNote("");
    toast.success("הערה נוספה");
    fetchData();
  };

  const deleteNote = async (noteId: string) => {
    if (!isAdmin) return;
    await supabase.from("activity_log").delete().eq("id", noteId);
    toast.success("הערה נמחקה");
    fetchData();
  };

  const updateFileUrl = async (field: string, url: string | null) => {
    if (!truck || !canUpload) return;
    await supabase.from("food_trucks").update({ [field]: url }).eq("id", truck.id);
    fetchData();
  };

  if (loading) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">טוען...</div>;
  if (!truck) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">פודטראק לא נמצא</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{truck.truck_name}</h1>
          <p className="text-muted-foreground">{truck.vehicle_type || "—"}</p>
        </div>
        <StatusBadge status={truck.status} className="text-sm" />
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">פרטי הרכב</TabsTrigger>
          <TabsTrigger value="review">מסמכים ועמידה בהנחיות</TabsTrigger>
          <TabsTrigger value="history">היסטוריה</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="municipal-shadow">
            <CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
              <InfoRow label="שם הפודטראק" value={truck.truck_name} />
              <InfoRow label="סוג רכב" value={truck.vehicle_type} />
              <InfoRow label="קטגוריית מזון" value={truck.food_category} icon={<MapPin className="h-4 w-4" />} />
              <InfoRow label="שעות פעילות" value={truck.hours_from && truck.hours_to ? `${truck.hours_from} - ${truck.hours_to}` : null} icon={<Clock className="h-4 w-4" />} />
              <InfoRow label="סטטוס" value={STATUS_LABELS[truck.status as TruckStatus] || truck.status} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combined: compliance on the left, documents on the right */}
        <TabsContent value="review">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Compliance checklist */}
            <Card className="municipal-shadow">
              <CardHeader>
                <CardTitle className="text-lg">רשימת עמידה בהנחיות</CardTitle>
                {!isAdmin && <p className="text-xs text-muted-foreground">צפייה בלבד</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                {COMPLIANCE_ITEMS.map((item) => {
                  const value = compliance ? (compliance as any)[item.key] ?? false : false;
                  return (
                    <div key={item.key} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                      {isAdmin ? (
                        <Checkbox
                          checked={!!value}
                          onCheckedChange={() => toggleCompliance(item.key, value)}
                        />
                      ) : (
                        value ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-destructive" />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </div>
                  );
                })}

                {isAdmin && (
                  <div className="pt-4 space-y-3 border-t">
                    <div>
                      <label className="text-sm font-medium mb-1 block">עדכון סטטוס</label>
                      <Select value={truck.status} onValueChange={(v) => updateStatus(v as TruckStatus)}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(STATUS_LABELS) as [TruckStatus, string][]).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">הערות מנהל</label>
                      <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="הוסף הערה..." />
                      <Button onClick={addNote} className="mt-2" size="sm" disabled={!newNote.trim()}>
                        הוסף הערה
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents & photos */}
            <Card className="municipal-shadow">
              <CardHeader>
                <CardTitle className="text-lg">תמונות ומסמכים</CardTitle>
                {!canUpload && <p className="text-xs text-muted-foreground">צפייה בלבד</p>}
              </CardHeader>
              <CardContent className="grid gap-4">
                {canUpload ? (
                  <>
                    <FileUpload bucket="truck-photos" storagePath={`${truck.id}/street`} currentUrl={truck.street_photo_1_url} onUploaded={(url) => updateFileUrl("street_photo_1_url", url)} onDeleted={() => updateFileUrl("street_photo_1_url", null)} accept="image/jpeg,image/png,image/webp" label="תמונת רחוב 1" />
                    <FileUpload bucket="truck-photos" storagePath={`${truck.id}/street`} currentUrl={truck.street_photo_2_url} onUploaded={(url) => updateFileUrl("street_photo_2_url", url)} onDeleted={() => updateFileUrl("street_photo_2_url", null)} accept="image/jpeg,image/png,image/webp" label="תמונת רחוב 2" />
                    <FileUpload bucket="truck-photos" storagePath={`${truck.id}/aerial`} currentUrl={truck.aerial_photo_url} onUploaded={(url) => updateFileUrl("aerial_photo_url", url)} onDeleted={() => updateFileUrl("aerial_photo_url", null)} accept="image/jpeg,image/png,image/webp" label="תמונה אווירית" />
                    <FileUpload bucket="truck-photos" storagePath={`${truck.id}/vehicle`} currentUrl={truck.vehicle_photo_url} onUploaded={(url) => updateFileUrl("vehicle_photo_url", url)} onDeleted={() => updateFileUrl("vehicle_photo_url", null)} accept="image/jpeg,image/png,image/webp" label="תמונת הרכב" />
                    <FileUpload bucket="documents" storagePath={`${truck.id}/license`} currentUrl={truck.business_license_url} onUploaded={(url) => updateFileUrl("business_license_url", url)} onDeleted={() => updateFileUrl("business_license_url", null)} accept="application/pdf,image/jpeg,image/png" label="רישיון עסק" isImage={false} />
                    <FileUpload bucket="documents" storagePath={`${truck.id}/design`} currentUrl={truck.design_mockup_url} onUploaded={(url) => updateFileUrl("design_mockup_url", url)} onDeleted={() => updateFileUrl("design_mockup_url", null)} accept="application/pdf,image/jpeg,image/png" label="הדמיית עיצוב" isImage={false} />
                  </>
                ) : (
                  <>
                    <PhotoPreview label="תמונת רחוב 1" url={truck.street_photo_1_url} />
                    <PhotoPreview label="תמונת רחוב 2" url={truck.street_photo_2_url} />
                    <PhotoPreview label="תמונה אווירית" url={truck.aerial_photo_url} />
                    <PhotoPreview label="תמונת הרכב" url={truck.vehicle_photo_url} />
                    <PhotoPreview label="רישיון עסק" url={truck.business_license_url} isImage={false} />
                    <PhotoPreview label="הדמיית עיצוב" url={truck.design_mockup_url} isImage={false} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="municipal-shadow">
            <CardHeader>
              <CardTitle className="text-lg">היסטוריה והערות</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-sm">אין היסטוריה עדיין</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0">
                      <div className="flex gap-3 items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${entry.action === "note" ? "bg-primary" : "bg-accent"}`} />
                        <div>
                          {entry.action === "status_change" ? (
                            <p className="text-sm">
                              שינוי סטטוס: {entry.old_status ? STATUS_LABELS[entry.old_status as TruckStatus] || entry.old_status : "חדש"} ← {STATUS_LABELS[entry.new_status as TruckStatus] || entry.new_status}
                            </p>
                          ) : (
                            <p className="text-sm">
                              <span className="font-medium text-primary">הערת מנהל: </span>
                              {entry.note}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString("he-IL")}</p>
                        </div>
                      </div>
                      {isAdmin && entry.action === "note" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteNote(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

function PhotoPreview({ label, url, isImage = true }: { label: string; url: string | null; isImage?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      {url ? (
        isImage ? (
          <img src={url} alt={label} className="w-full h-32 object-cover rounded-lg border" />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">צפה בקובץ</a>
        )
      ) : (
        <p className="text-xs text-muted-foreground">לא הועלה</p>
      )}
    </div>
  );
}
