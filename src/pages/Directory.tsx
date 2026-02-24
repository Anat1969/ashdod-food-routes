import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/StatusBadge";
import { Search, Zap, Droplets, CircleDot } from "lucide-react";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { toast } from "sonner";

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
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">מאגר פודטראקים</h1>
      <p className="text-muted-foreground mb-6">רשימת הפודטראקים הרשומים בעיר אשדוד</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם או קטגוריה..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
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
                <TableHead className="text-right">סוג עמדה</TableHead>
                <TableHead className="text-right">עמדה</TableHead>
                <TableHead className="text-right">פודטראק</TableHead>
                <TableHead className="text-right">תשתית</TableHead>
                <TableHead className="text-right">שם המפעיל</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך הגשה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((truck) => (
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
                  {/* מיקום עמדה */}
                  <TableCell>
                    <Checkbox checked={!!truck.location} disabled />
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
