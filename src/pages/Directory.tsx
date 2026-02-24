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

  const filtered = trucks.filter((t) => {
    const matchesSearch = !search || t.truck_name.includes(search) || (t.food_category || "").includes(search) || (t.location?.name || "").includes(search);
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
                <TableHead className="text-right">פעל</TableHead>
                <TableHead className="text-right">מיקום עמדה</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך הגשה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((truck) => (
                <TableRow key={truck.id} className="cursor-pointer hover:bg-muted/50">
                  {/* סוג עמדה */}
                  <TableCell>
                    {truck.location?.location_type || "—"}
                  </TableCell>
                  {/* עמדה */}
                  <TableCell>
                    <Link to={`/truck/${truck.id}`} className="font-medium text-primary hover:underline">
                      {truck.truck_name}
                    </Link>
                  </TableCell>
                  {/* פודטראק */}
                  <TableCell>{truck.food_category || "—"}</TableCell>
                  {/* תשתית */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={truck.location?.infra_electricity ? "text-green-600" : "text-muted-foreground"}>
                        <Zap className="h-4 w-4 inline" />
                      </span>
                      <span className={truck.location?.infra_water ? "text-green-600" : "text-muted-foreground"}>
                        <Droplets className="h-4 w-4 inline" />
                      </span>
                      <span className={truck.location?.infra_sewage ? "text-green-600" : "text-muted-foreground"}>
                        <CircleDot className="h-4 w-4 inline" />
                      </span>
                    </div>
                  </TableCell>
                  {/* פעל */}
                  <TableCell>
                    <Checkbox checked={!!truck.vehicle_type} disabled />
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
