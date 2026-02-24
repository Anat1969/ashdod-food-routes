import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TruckCard from "@/components/TruckCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { FoodTruck, TruckStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

export default function Directory() {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*")
        .order("created_at", { ascending: false });
      setTrucks((data as FoodTruck[]) || []);
      setLoading(false);
    };
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
    const matchesSearch = !search || t.name.includes(search) || t.operator_name.includes(search) || (t.neighborhood || "").includes(search);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">מאגר פודטראקים</h1>
      <p className="text-muted-foreground mb-6">רשימת הפודטראקים הרשומים בעיר אשדוד</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם, מפעיל או שכונה..."
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      )}
    </div>
  );
}
