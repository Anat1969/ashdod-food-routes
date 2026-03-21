import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/StatusBadge";
import { Search, Zap, Droplets, CircleDot, ArrowUp, ArrowDown, ArrowUpDown, Check, X, Trash2, ImagePlus, Eye, Pencil, Sparkles, Loader2 } from "lucide-react";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { toast } from "sonner";
import ashdodMap from "@/assets/ashdod-map.jpeg";
import PageNavigation from "@/components/PageNavigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SortDirection = "asc" | "desc" | null;
type SortColumn = "station_type" | "truck_name" | "has_truck" | "operator_name" | "status" | "submitted_at" | "environment_ok" | "truck_condition_ok" | null;

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-500",
  rejected: "bg-red-500",
  under_review: "bg-orange-400",
  submitted: "bg-blue-500",
  draft: "bg-yellow-400",
};

const STATION_TYPES = [
  "חוף אקספנסיבי",
  "מרינה",
  "חוף אינטנסיבי",
  "נחל לכיש",
  "פארקים",
] as const;

interface LocationData {
  id: string;
  location_type: string | null;
  infra_electricity: boolean;
  infra_water: boolean;
  infra_sewage: boolean;
  is_desired: boolean;
  name: string;
  street: string | null;
  neighborhood: string | null;
}

interface TruckWithLocation extends FoodTruck {
  location?: LocationData | null;
}

interface ExpertOpinion {
  id: string;
  truck_id: string;
  location_analysis: string | null;
  recommendation: string | null;
  executive_summary: string | null;
  is_final: boolean;
}

function TriStateButtons({
  value,
  onChange,
}: {
  value: boolean | null | undefined;
  onChange: (val: boolean | null) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(value === true ? null : true)}
        className={`p-1 rounded transition-colors ${
          value === true
            ? "bg-green-100 text-green-700 ring-1 ring-green-400"
            : "text-muted-foreground hover:bg-muted"
        }`}
        title="תקין"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange(value === false ? null : false)}
        className={`p-1 rounded transition-colors ${
          value === false
            ? "bg-red-100 text-red-700 ring-1 ring-red-400"
            : "text-muted-foreground hover:bg-muted"
        }`}
        title="לא תקין"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Directory() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [operatorEdits, setOperatorEdits] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"edit" | "conclusions">("edit");
  const [opinions, setOpinions] = useState<Record<string, ExpertOpinion>>({});
  const [generatingOpinion, setGeneratingOpinion] = useState<Record<string, boolean>>({});

  const fetchTrucks = async () => {
    const { data, error } = await supabase
      .from("food_trucks")
      .select("*, location:locations(*)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching trucks:", error);
    }
    setTrucks((data as TruckWithLocation[]) || []);
    setLoading(false);
  };
  const fetchOpinions = async () => {
    const { data } = await supabase
      .from("expert_opinions")
      .select("id, truck_id, location_analysis, recommendation, executive_summary, is_final")
      .order("created_at", { ascending: false });
    if (data) {
      const map: Record<string, ExpertOpinion> = {};
      data.forEach((op) => {
        if (!map[op.truck_id]) map[op.truck_id] = op as ExpertOpinion;
      });
      setOpinions(map);
    }
  };

  useEffect(() => {
    fetchTrucks();
    fetchOpinions();
    const channel = supabase
      .channel("food_trucks_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_trucks" }, () => {
        fetchTrucks();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  const generateOpinionForTruck = async (truck: TruckWithLocation) => {
    setGeneratingOpinion((prev) => ({ ...prev, [truck.id]: true }));
    try {
      const payload = {
        is_desired: truck.location?.is_desired ?? null,
        vehicle_type: truck.vehicle_type,
        structure_ok: truck.truck_condition_ok,
        infra_electricity: truck.location?.infra_electricity ?? null,
        infra_water: truck.location?.infra_water ?? null,
        infra_sewage: truck.location?.infra_sewage ?? null,
        environment_ok: truck.environment_ok,
        operator_name: truck.operator_name,
        location_name: truck.location?.name ?? null,
        existing_building_approval: truck.vehicle_type ? true : null,
      };

      const { data, error } = await supabase.functions.invoke("generate-opinion", {
        body: payload,
      });

      if (error) throw error;

      const { field_notes, conditions } = data as { field_notes: string; conditions: string };

      const existing = opinions[truck.id];
      if (existing) {
        await supabase
          .from("expert_opinions")
          .update({
            executive_summary: field_notes,
            recommendation: conditions,
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("expert_opinions")
          .insert({
            truck_id: truck.id,
            executive_summary: field_notes,
            recommendation: conditions,
          });
      }

      await fetchOpinions();
      toast.success("חוות דעת והמלצה נוצרו בהצלחה");
    } catch (e) {
      console.error("generateOpinion error:", e);
      toast.error("שגיאה ביצירת חוות דעת");
    } finally {
      setGeneratingOpinion((prev) => ({ ...prev, [truck.id]: false }));
    }
  };

  const updateField = async (truckId: string, field: string, value: any) => {
    const { error } = await supabase
      .from("food_trucks")
      .update({ [field]: value } as any)
      .eq("id", truckId);
    if (error) {
      toast.error("שגיאה בעדכון");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) => (t.id === truckId ? { ...t, [field]: value } : t))
    );
  };

  const updateLocationType = async (truck: TruckWithLocation, value: string) => {
    if (!truck.location_id || !truck.location) return;
    const { error } = await supabase
      .from("locations")
      .update({ location_type: value })
      .eq("id", truck.location_id);
    if (error) {
      toast.error("שגיאה בעדכון סוג עמדה");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truck.id ? { ...t, location: { ...t.location!, location_type: value } } : t
      )
    );
  };

  const updateInfra = async (truck: TruckWithLocation, field: "infra_electricity" | "infra_water" | "infra_sewage", checked: boolean) => {
    if (!truck.location_id || !truck.location) return;
    const { error } = await supabase
      .from("locations")
      .update({ [field]: checked })
      .eq("id", truck.location_id);
    if (error) {
      toast.error("שגיאה בעדכון תשתית");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truck.id ? { ...t, location: { ...t.location!, [field]: checked } } : t
      )
    );
  };

  const deleteTruck = async (truckId: string) => {
    const { error } = await supabase
      .from("food_trucks")
      .delete()
      .eq("id", truckId);
    if (error) {
      toast.error("שגיאה במחיקת רשומה");
      return;
    }
    setTrucks((prev) => prev.filter((t) => t.id !== truckId));
    toast.success("הרשומה נמחקה בהצלחה");
  };

  const handleImageUpload = async (truckId: string, file: File, field: "vehicle_photo_url" | "street_photo_1_url" | "street_photo_2_url" | "aerial_photo_url", folder: string) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${truckId}/${folder}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("truck-photos")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("שגיאה בהעלאת תמונה");
      return;
    }
    const { data: urlData } = supabase.storage
      .from("truck-photos")
      .getPublicUrl(path);
    await updateField(truckId, field, urlData.publicUrl);
    toast.success("התמונה נשמרה");
  };

  const ImageCell = ({ truck, field, folder }: { truck: TruckWithLocation; field: "vehicle_photo_url" | "street_photo_1_url" | "street_photo_2_url" | "aerial_photo_url"; folder: string }) => {
    const url = truck[field];
    if (url) {
      return (
        <div className="relative group w-[60px] h-[40px]">
          <img src={url} alt="" className="w-full h-full object-cover rounded" />
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded cursor-pointer">
            <ImagePlus className="h-4 w-4 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(truck.id, file, field, folder);
            }} />
          </label>
        </div>
      );
    }
    return (
      <label
        className="flex items-center justify-center w-[60px] h-[40px] border-2 border-dashed border-muted-foreground/30 rounded cursor-pointer hover:border-primary/50 transition-colors"
        onPaste={(e) => {
          const file = e.clipboardData.files?.[0];
          if (file && file.type.startsWith("image/")) handleImageUpload(truck.id, file, field, folder);
        }}
        tabIndex={0}
      >
        <ImagePlus className="h-4 w-4 text-muted-foreground" />
        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(truck.id, file, field, folder);
        }} />
      </label>
    );
  };

  const updateStatus = async (truckId: string, newStatus: string) => {
    const { error } = await supabase
      .from("food_trucks")
      .update({ status: newStatus })
      .eq("id", truckId);
    if (error) {
      toast.error("שגיאה בעדכון סטטוס");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) => (t.id === truckId ? { ...t, status: newStatus } : t))
    );
  };

  const filtered = trucks.filter((t) => {
    const matchesSearch = !search || t.truck_name.includes(search) || (t.food_category || "").includes(search) || (t.location?.name || "").includes(search) || (t.operator_name || "").includes(search);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesZone = zoneFilter === "all" || (t.location?.location_type || "") === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const toggleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortColumn(null); setSortDirection(null); }
      else setSortDirection("asc");
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortColumn || !sortDirection) return filtered;
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let valA = "";
      let valB = "";
      switch (sortColumn) {
        case "station_type":
          valA = a.location?.location_type || "";
          valB = b.location?.location_type || "";
          break;
        case "truck_name":
          valA = a.truck_name || "";
          valB = b.truck_name || "";
          break;
        case "has_truck":
          valA = a.vehicle_type ? "1" : "0";
          valB = b.vehicle_type ? "1" : "0";
          break;
        case "operator_name":
          valA = a.operator_name || "";
          valB = b.operator_name || "";
          break;
        case "status":
          valA = STATUS_LABELS[a.status as TruckStatus] || a.status;
          valB = STATUS_LABELS[b.status as TruckStatus] || b.status;
          break;
        case "submitted_at":
          valA = a.submitted_at || "";
          valB = b.submitted_at || "";
          break;
        case "environment_ok":
          valA = a.environment_ok === true ? "1" : a.environment_ok === false ? "0" : "";
          valB = b.environment_ok === true ? "1" : b.environment_ok === false ? "0" : "";
          break;
        case "truck_condition_ok":
          valA = a.truck_condition_ok === true ? "1" : a.truck_condition_ok === false ? "0" : "";
          valB = b.truck_condition_ok === true ? "1" : b.truck_condition_ok === false ? "0" : "";
          break;
      }
      return valA.localeCompare(valB, "he") * dir;
    });
  }, [filtered, sortColumn, sortDirection]);

  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortColumn !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    if (sortDirection === "asc") return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <PageNavigation />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">מאגר פודטראקים</h1>
      <p className="text-muted-foreground mb-6">רשימת הפודטראקים הרשומים בעיר אשדוד</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם או קטגוריה..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setZoneFilter("all"); }}
            className="pr-10 h-12 text-base border-2 border-primary/40 focus:border-primary shadow-sm rounded-l-none"
          />
        </div>
        <Select value={zoneFilter} onValueChange={(val) => { setZoneFilter(val); if (val !== "all") setSearch(""); }}>
          <SelectTrigger className="w-[180px] h-12 text-base border-2 border-primary/40 focus:border-primary shadow-sm">
            <SelectValue placeholder="סוג עמדה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל האזורים</SelectItem>
            {STATION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-12 text-base border-2 border-primary/40 focus:border-primary shadow-sm">
            <SelectValue placeholder="סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            {(Object.entries(STATUS_LABELS) as [TruckStatus, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={viewMode === "conclusions" ? "default" : "outline"}
          size="lg"
          className="h-12 px-4 gap-2"
          onClick={() => setViewMode(viewMode === "edit" ? "conclusions" : "edit")}
        >
          {viewMode === "edit" ? (
            <>
              <Eye className="h-4 w-4" />
              צפייה במסקנות
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              עריכת נתונים
            </>
          )}
        </Button>
      </div>

      <div className="mb-6 rounded-lg overflow-hidden border shadow-sm">
        <img src={ashdodMap} alt="מפת פודטראקים באשדוד" className="w-full h-auto object-cover max-h-[250px]" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">טוען...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {trucks.length === 0 ? "אין פודטראקים רשומים עדיין" : "לא נמצאו תוצאות"}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("station_type")}>
                  <span className="flex items-center gap-1">סוג עמדה <SortIcon col="station_type" /></span>
                </TableHead>
                <TableHead className="text-right">מיקום</TableHead>
                <TableHead className="text-right">סביבה</TableHead>
                <TableHead className="text-right">מבנה</TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("truck_name")}>
                  <span className="flex items-center gap-1">עמדה <SortIcon col="truck_name" /></span>
                </TableHead>
                {viewMode === "edit" && (
                  <>
                    <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("has_truck")}>
                      <span className="flex items-center gap-1">מבנה קיים בפועל <SortIcon col="has_truck" /></span>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span>תשתית</span>
                        <span className="text-[10px] font-normal text-muted-foreground flex items-center gap-2">
                          <span>חשמל</span>
                          <span>מים</span>
                          <span>ביוב</span>
                        </span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("environment_ok")}>
                      <span className="flex items-center gap-1">סביבה תקינה <SortIcon col="environment_ok" /></span>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("truck_condition_ok")}>
                      <span className="flex items-center gap-1">מבנה תקין <SortIcon col="truck_condition_ok" /></span>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("operator_name")}>
                      <span className="flex items-center gap-1">מפעיל <SortIcon col="operator_name" /></span>
                    </TableHead>
                  </>
                )}
                {viewMode === "conclusions" && (
                  <>
                    <TableHead className="text-right min-w-[200px]">ניתוח מצב קיים</TableHead>
                    <TableHead className="text-right min-w-[150px]">המלצה</TableHead>
                  </>
                )}
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("status")}>
                  <span className="flex items-center gap-1">סטטוס <SortIcon col="status" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("submitted_at")}>
                  <span className="flex items-center gap-1">תאריך הגשה <SortIcon col="submitted_at" /></span>
                </TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((truck) => (
                <TableRow key={truck.id} className="hover:bg-muted/50">
                  {/* סוג עמדה */}
                  <TableCell>
                    {viewMode === "edit" ? (
                      <Select
                        value={truck.location?.location_type || ""}
                        onValueChange={(val) => updateLocationType(truck, val)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs">{truck.location?.location_type || "—"}</span>
                    )}
                  </TableCell>
                  {/* מיקום - תמונה */}
                  <TableCell>
                    <ImageCell truck={truck} field="street_photo_1_url" folder="street" />
                  </TableCell>
                  {/* סביבה - תמונה */}
                  <TableCell>
                    <ImageCell truck={truck} field="street_photo_2_url" folder="street2" />
                  </TableCell>
                  {/* מבנה - תמונה */}
                  <TableCell>
                    <ImageCell truck={truck} field="vehicle_photo_url" folder="vehicle" />
                  </TableCell>
                  {/* עמדה */}
                  <TableCell>
                    <Link to={`/truck/${truck.id}`} className="font-medium text-primary hover:underline">
                      {truck.truck_name}
                    </Link>
                  </TableCell>
                  {/* Edit-only columns */}
                  {viewMode === "edit" && (
                    <>
                      {/* מבנה קיים בפועל */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={!!truck.vehicle_type}
                            onCheckedChange={(checked) =>
                              updateField(truck.id, "vehicle_type", checked ? "פודטראק" : null)
                            }
                          />
                          {truck.vehicle_type ? (
                            <Input
                              className="h-8 text-xs w-[120px]"
                              placeholder="שם העסק"
                              value={truck.vehicle_type === "פודטראק" ? "" : truck.vehicle_type}
                              onChange={(e) => {
                                const val = e.target.value || "פודטראק";
                                setTrucks((prev) => prev.map((t) => t.id === truck.id ? { ...t, vehicle_type: val } : t));
                              }}
                              onBlur={() => {
                                updateField(truck.id, "vehicle_type", truck.vehicle_type || "פודטראק");
                              }}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">לא מאויש</span>
                          )}
                        </div>
                      </TableCell>
                      {/* תשתית */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1" title="חשמל">
                            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                            <Checkbox
                              checked={truck.location?.infra_electricity ?? false}
                              onCheckedChange={(checked) => updateInfra(truck, "infra_electricity", !!checked)}
                            />
                          </div>
                          <div className="flex items-center gap-1" title="מים">
                            <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                            <Checkbox
                              checked={truck.location?.infra_water ?? false}
                              onCheckedChange={(checked) => updateInfra(truck, "infra_water", !!checked)}
                            />
                          </div>
                          <div className="flex items-center gap-1" title="ביוב">
                            <CircleDot className="h-3.5 w-3.5 text-muted-foreground" />
                            <Checkbox
                              checked={truck.location?.infra_sewage ?? false}
                              onCheckedChange={(checked) => updateInfra(truck, "infra_sewage", !!checked)}
                            />
                          </div>
                        </div>
                      </TableCell>
                      {/* סביבה תקינה */}
                      <TableCell>
                        <TriStateButtons
                          value={truck.environment_ok}
                          onChange={(val) => updateField(truck.id, "environment_ok", val)}
                        />
                      </TableCell>
                      {/* מבנה תקין */}
                      <TableCell>
                        <TriStateButtons
                          value={truck.truck_condition_ok}
                          onChange={(val) => updateField(truck.id, "truck_condition_ok", val)}
                        />
                      </TableCell>
                      {/* מפעיל */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={!!(truck as any).has_operator}
                            onCheckedChange={(checked) => {
                              updateField(truck.id, "has_operator", !!checked);
                              if (!checked) {
                                updateField(truck.id, "operator_name", null);
                                setOperatorEdits((prev) => {
                                  const next = { ...prev };
                                  delete next[truck.id];
                                  return next;
                                });
                              }
                            }}
                          />
                          {(truck as any).has_operator ? (
                            <Input
                              className="h-8 text-xs w-[120px]"
                              placeholder="שם המפעיל"
                              value={operatorEdits[truck.id] ?? truck.operator_name ?? ""}
                              onChange={(e) => setOperatorEdits((prev) => ({ ...prev, [truck.id]: e.target.value }))}
                              onBlur={() => {
                                const val = operatorEdits[truck.id];
                                if (val !== undefined && val !== (truck.operator_name ?? "")) {
                                  updateField(truck.id, "operator_name", val || null);
                                }
                              }}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">אין</span>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                  {/* Conclusions-only columns */}
                  {viewMode === "conclusions" && (
                    <>
                      {/* ניתוח מצב קיים */}
                      <TableCell>
                        {opinions[truck.id]?.executive_summary || opinions[truck.id]?.location_analysis ? (
                          <p className="text-xs leading-relaxed text-foreground max-w-[250px]">
                            {opinions[truck.id]?.executive_summary || opinions[truck.id]?.location_analysis}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground">אין ניתוח</span>
                        )}
                      </TableCell>
                      {/* המלצה */}
                      <TableCell>
                        {opinions[truck.id]?.recommendation ? (
                          <p className="text-xs leading-relaxed font-medium text-foreground max-w-[200px]">
                            {opinions[truck.id]?.recommendation}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </>
                  )}
                  {/* סטטוס */}
                  <TableCell>
                    {viewMode === "edit" ? (
                      <Select
                        value={truck.status}
                        onValueChange={(val) => updateStatus(truck.id, val)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(STATUS_LABELS) as [TruckStatus, string][]).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_COLORS[key] || "bg-muted"}`} />
                                {label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={truck.status as TruckStatus} />
                    )}
                  </TableCell>
                  {/* תאריך הגשה */}
                  <TableCell>
                    {truck.submitted_at
                      ? new Date(truck.submitted_at).toLocaleDateString("he-IL")
                      : "—"}
                  </TableCell>
                  {/* מחיקה */}
                  <TableCell>
                    {viewMode === "edit" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>מחיקת רשומה</AlertDialogTitle>
                            <AlertDialogDescription>
                              האם למחוק את "{truck.truck_name}"? פעולה זו אינה ניתנת לביטול.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row-reverse gap-2">
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTruck(truck.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              מחק
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
