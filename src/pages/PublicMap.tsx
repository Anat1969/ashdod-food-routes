import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import TruckMap from "@/components/TruckMap";
import { Search, Clock, Utensils, MapPin } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useRegisterList } from "@/hooks/useListNavigation";
import type { FoodTruck, Location } from "@/lib/types";

type TruckWithLocation = FoodTruck & { locations: Location | null };

const CATEGORIES = [
  "המבורגרים",
  "פיצה",
  "אסייתי",
  "קינוחים",
  "ים תיכוני",
  "צ'יפס",
  "מיצים",
];

export default function PublicMap() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApproved = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*, locations(*)")
        .eq("status", "approved")
        .order("truck_name");
      setTrucks((data as TruckWithLocation[]) || []);
      setLoading(false);
    };
    fetchApproved();
  }, []);

  const filtered = trucks.filter((t) => {
    const matchSearch =
      !search ||
      t.truck_name.includes(search) ||
      (t.food_category || "").includes(search) ||
      (t.locations?.name || "").includes(search);
    const matchCat =
      categoryFilter === "all" || (t.food_category || "").includes(categoryFilter);
    return matchSearch && matchCat;
  });

  // Sort filtered by address
  const sortedFiltered = [...filtered].sort((a, b) => {
    const streetA = a.locations?.street || a.locations?.name || "";
    const streetB = b.locations?.street || b.locations?.name || "";
    return streetA.localeCompare(streetB, "he");
  });

  // Register list for record navigation
  useRegisterList(
    sortedFiltered.map((t) => ({ id: t.id, label: t.truck_name })),
    "/map",
    "/truck/",
    "address"
  );

  const selectedTruck = sortedFiltered.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" dir="rtl">
      {/* Navigation */}
      <div className="px-4 pt-2">
        <PageNavigation />
      </div>
      {/* Top bar */}
      <div className="bg-background border-b px-4 py-3 flex flex-col sm:flex-row gap-2 z-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש עמדה, קטגוריה, מיקום..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 h-9 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="קטגוריה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הקטגוריות</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground self-center">
          {sortedFiltered.length} עמדות פעילות
        </span>
      </div>

      {/* Main: map + list */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              טוען מפה...
            </div>
          ) : (
            <TruckMap
              trucks={sortedFiltered}
              selectedTruckId={selectedId}
              onSelectTruck={(t) => setSelectedId(t.id)}
            />
          )}
        </div>

        {/* Side list */}
        <div className="w-80 hidden md:flex flex-col border-r bg-background overflow-y-auto">
          <div className="p-3 border-b bg-muted/30">
            <h2 className="font-semibold text-sm">עמדות אוכל פעילות</h2>
          </div>

          {loading ? (
            <div className="p-4 text-sm text-muted-foreground text-center">טוען...</div>
          ) : sortedFiltered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              לא נמצאו עמדות
            </div>
          ) : (
            <div className="divide-y">
              {sortedFiltered.map((truck) => (
                <TruckSideCard
                  key={truck.id}
                  truck={truck}
                  selected={truck.id === selectedId}
                  onClick={() => setSelectedId(truck.id === selectedId ? null : truck.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet for selected truck */}
      {selectedTruck && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-background border-t rounded-t-xl shadow-lg p-4 z-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-base">{selectedTruck.truck_name}</h3>
              {selectedTruck.food_category && (
                <p className="text-sm text-muted-foreground">{selectedTruck.food_category}</p>
              )}
              {selectedTruck.locations?.name && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {selectedTruck.locations.name}
                </p>
              )}
              {(selectedTruck.hours_from && selectedTruck.hours_to) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {selectedTruck.hours_from} – {selectedTruck.hours_to}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to={`/truck/${selectedTruck.id}`}
                className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium"
              >
                תפריט ופרטים
              </Link>
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs text-muted-foreground underline"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TruckSideCard({
  truck,
  selected,
  onClick,
}: {
  truck: TruckWithLocation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`p-3 cursor-pointer transition-colors hover:bg-muted/40 ${selected ? "bg-primary/5 border-r-2 border-primary" : ""}`}
      onClick={onClick}
    >
      {/* Photo or placeholder */}
      {truck.vehicle_photo_url ? (
        <img
          src={truck.vehicle_photo_url}
          alt={truck.truck_name}
          className="w-full h-28 object-cover rounded-md mb-2"
        />
      ) : truck.street_photo_1_url ? (
        <img
          src={truck.street_photo_1_url}
          alt={truck.truck_name}
          className="w-full h-28 object-cover rounded-md mb-2"
        />
      ) : (
        <div className="w-full h-24 bg-muted rounded-md mb-2 flex items-center justify-center">
          <Utensils className="h-8 w-8 text-muted-foreground/40" />
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{truck.truck_name}</h3>
          {truck.food_category && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {truck.food_category}
            </Badge>
          )}
        </div>

        {truck.locations?.name && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {truck.locations.name}
          </p>
        )}

        {truck.hours_from && truck.hours_to && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            {truck.hours_from} – {truck.hours_to}
          </p>
        )}

        <Link
          to={`/truck/${truck.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-block text-xs text-primary hover:underline mt-1 font-medium"
        >
          תפריט ופרטים ←
        </Link>
      </div>
    </div>
  );
}
