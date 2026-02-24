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
import { COMPLIANCE_ITEMS } from "@/lib/types";
import type { FoodTruck, TruckStatus, ComplianceItem, StatusHistoryEntry, AdminNote } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { Phone, Mail, Clock, MapPin, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function TruckProfile() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const [truck, setTruck] = useState<FoodTruck | null>(null);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    const [truckRes, complianceRes, historyRes, notesRes] = await Promise.all([
      supabase.from("food_trucks").select("*").eq("id", id).single(),
      supabase.from("compliance_checklist").select("*").eq("truck_id", id),
      supabase.from("status_history").select("*").eq("truck_id", id).order("created_at", { ascending: false }),
      supabase.from("admin_notes").select("*").eq("truck_id", id).order("created_at", { ascending: false }),
    ]);
    setTruck(truckRes.data as FoodTruck | null);
    setCompliance((complianceRes.data as ComplianceItem[]) || []);
    setHistory((historyRes.data as StatusHistoryEntry[]) || []);
    setNotes((notesRes.data as AdminNote[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateStatus = async (newStatus: TruckStatus) => {
    if (!truck) return;
    await supabase.from("food_trucks").update({ status: newStatus }).eq("id", truck.id);
    await supabase.from("status_history").insert({
      truck_id: truck.id,
      old_status: truck.status,
      new_status: newStatus,
    });
    toast.success("הסטטוס עודכן בהצלחה");
    fetchData();
  };

  const toggleCompliance = async (itemKey: string, currentPassed: boolean) => {
    if (!truck || !isAdmin) return;
    const existing = compliance.find(c => c.item_key === itemKey);
    if (existing) {
      await supabase.from("compliance_checklist").update({ passed: !currentPassed }).eq("id", existing.id);
    } else {
      const item = COMPLIANCE_ITEMS.find(i => i.key === itemKey);
      await supabase.from("compliance_checklist").insert({
        truck_id: truck.id,
        item_key: itemKey,
        item_label: item?.label || itemKey,
        passed: true,
      });
    }
    fetchData();
  };

  const addNote = async () => {
    if (!truck || !newNote.trim()) return;
    await supabase.from("admin_notes").insert({ truck_id: truck.id, note: newNote.trim() });
    setNewNote("");
    toast.success("הערה נוספה");
    fetchData();
  };

  if (loading) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">טוען...</div>;
  if (!truck) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">פודטראק לא נמצא</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{truck.name}</h1>
          <p className="text-muted-foreground">{truck.operator_name}</p>
        </div>
        <StatusBadge status={truck.status} className="text-sm" />
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">פרטי הרכב</TabsTrigger>
          <TabsTrigger value="location">מיקום וסביבה</TabsTrigger>
          <TabsTrigger value="compliance">עמידה בהנחיות</TabsTrigger>
          <TabsTrigger value="history">היסטוריה ומסמכים</TabsTrigger>
        </TabsList>

        {/* Tab A - Details */}
        <TabsContent value="details">
          <Card className="municipal-shadow">
            <CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
              <InfoRow label="שם הפודטראק" value={truck.name} />
              <InfoRow label="שם המפעיל" value={truck.operator_name} />
              <InfoRow label="מספר זיהוי" value={truck.operator_id} />
              <InfoRow label="סוג רכב" value={truck.vehicle_type} />
              <InfoRow label="תיאור הרכב / עטיפה" value={truck.vehicle_description} />
              <InfoRow label="סוג מזון" value={truck.cuisine} icon={<MapPin className="h-4 w-4" />} />
              <InfoRow label="שעות פעילות" value={truck.operating_hours} icon={<Clock className="h-4 w-4" />} />
              <InfoRow label="טלפון" value={truck.contact_phone} icon={<Phone className="h-4 w-4" />} />
              <InfoRow label="אימייל" value={truck.contact_email} icon={<Mail className="h-4 w-4" />} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab B - Location */}
        <TabsContent value="location">
          <Card className="municipal-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow label="כתובת" value={truck.street_address} />
                <InfoRow label="שכונה" value={truck.neighborhood} />
              </div>
              {truck.latitude && truck.longitude && (
                <div className="rounded-lg overflow-hidden border h-[300px]">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${truck.latitude},${truck.longitude}&z=16&output=embed`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab C - Compliance */}
        <TabsContent value="compliance">
          <Card className="municipal-shadow">
            <CardHeader>
              <CardTitle className="text-lg">רשימת עמידה בהנחיות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {COMPLIANCE_ITEMS.map((item) => {
                const entry = compliance.find(c => c.item_key === item.key);
                const passed = entry?.passed ?? false;
                return (
                  <div key={item.key} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                    {isAdmin ? (
                      <Checkbox
                        checked={passed}
                        onCheckedChange={() => toggleCompliance(item.key, passed)}
                      />
                    ) : (
                      passed ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />
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
        </TabsContent>

        {/* Tab D - History */}
        <TabsContent value="history">
          <Card className="municipal-shadow">
            <CardHeader>
              <CardTitle className="text-lg">היסטוריית שינויים</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 && notes.length === 0 ? (
                <p className="text-muted-foreground text-sm">אין היסטוריה עדיין</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          שינוי סטטוס: {entry.old_status ? STATUS_LABELS[entry.old_status] : "חדש"} ← {STATUS_LABELS[entry.new_status]}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString("he-IL")}</p>
                      </div>
                    </div>
                  ))}
                  {notes.map((note) => (
                    <div key={note.id} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString("he-IL")}</p>
                      </div>
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
