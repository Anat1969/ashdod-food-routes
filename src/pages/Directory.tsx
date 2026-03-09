import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/StatusBadge";
import { Search, Zap, Droplets, CircleDot, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { toast } from "sonner";
import ashdodMap from "@/assets/ashdod-map.jpeg";
import PageNavigation from "@/components/PageNavigation";

type SortDirection = "asc" | "desc" | null;
type SortColumn = "station_type" | "truck_name" | "has_truck" | "operator_name" | "status" | "submitted_at" | null;

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
  name: string;
  street: string | null;
  neighborhood: string | null;
}

interface TruckWithLocation extends FoodTruck {
  location?: LocationData | null;
}

export default function Directory() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  useEffect(() => {
    fetchTrucks();

    const channel = supabase
      .channel("food_trucks_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_trucks" }, () => {
        fetchTrucks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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

  const updateHasTruck = async (truck: TruckWithLocation, checked: boolean) => {
    const { error } = await supabase
      .from("food_trucks")
      .update({ vehicle_type: checked ? "פודטראק" : null })
      .eq("id", truck.id);
    if (error) {
      toast.error("שגיאה בעדכון פודטראק");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truck.id ? { ...t, vehicle_type: checked ? "פודטראק" : null } : t
      )
    );
  };

  const [operatorEdits, setOperatorEdits] = useState<Record<string, string>>({});

  const updateOperatorName = async (truckId: string, value: string) => {
    const { error } = await supabase
      .from("food_trucks")
      .update({ operator_name: value || null } as any)
      .eq("id", truckId);
    if (error) {
      toast.error("שגיאה בעדכון שם המפעיל");
      return;
    }
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId ? { ...t, operator_name: value || null } : t
      )
    );
  };

  const filtered = trucks.filter((t) => {
    const matchesSearch = !search || t.truck_name.includes(search) || (t.food_category || "").includes(search) || (t.location?.name || "").includes(search) || ((t as any).operator_name || "").includes(search);
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
          valA = (a as any).operator_name || "";
          valB = (b as any).operator_name || "";
          break;
        case "status":
          valA = STATUS_LABELS[a.status as TruckStatus] || a.status;
          valB = STATUS_LABELS[b.status as TruckStatus] || b.status;
          break;
        case "submitted_at":
          valA = a.submitted_at || "";
          valB = b.submitted_at || "";
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
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("truck_name")}>
                  <span className="flex items-center gap-1">עמדה <SortIcon col="truck_name" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("has_truck")}>
                  <span className="flex items-center gap-1">פודטראק <SortIcon col="has_truck" /></span>
                </TableHead>
                <TableHead className="text-right">תשתית</TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("operator_name")}>
                  <span className="flex items-center gap-1">שם המפעיל <SortIcon col="operator_name" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("status")}>
                  <span className="flex items-center gap-1">סטטוס <SortIcon col="status" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort("submitted_at")}>
                  <span className="flex items-center gap-1">תאריך הגשה <SortIcon col="submitted_at" /></span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((truck) => (
                <TableRow key={truck.id} className="cursor-pointer hover:bg-muted/50">
                  {/* סוג עמדה - dropdown */}
                  <TableCell>
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
                  </TableCell>
                  {/* עמדה */}
                  <TableCell>
                    <Link to={`/truck/${truck.id}`} className="font-medium text-primary hover:underline">
                      {truck.truck_name}
                    </Link>
                  </TableCell>
                  {/* פודטראק - checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={!!truck.vehicle_type}
                      onCheckedChange={(checked) => updateHasTruck(truck, !!checked)}
                    />
                  </TableCell>
                  {/* תשתית - 3 checkboxes */}
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
                  {/* שם המפעיל */}
                  <TableCell>
                    <Input
                      className={`h-8 text-xs w-[140px] ${(truck as any).operator_name ? "border-green-500" : "border-destructive"}`}
                      placeholder="שם המפעיל"
                      value={operatorEdits[truck.id] ?? (truck as any).operator_name ?? ""}
                      onChange={(e) => setOperatorEdits((prev) => ({ ...prev, [truck.id]: e.target.value }))}
                      onBlur={() => {
                        const val = operatorEdits[truck.id];
                        if (val !== undefined && val !== ((truck as any).operator_name ?? "")) {
                          updateOperatorName(truck.id, val);
                        }
                      }}
                    />
                  </TableCell>
                  {/* סטטוס */}
                  <TableCell>
                    <StatusBadge status={truck.status} />
                  </TableCell>
                  {/* תאריך הגשה */}
                  <TableCell>
                    {truck.submitted_at
                      ? new Date(truck.submitted_at).toLocaleDateString("he-IL")
                      : "—"}
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
