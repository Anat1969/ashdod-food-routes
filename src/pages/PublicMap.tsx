import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import TruckMap from "@/components/TruckMap";
import { Search, Clock, UtensilsCrossed, MapPin, ChevronLeft } from "lucide-react";
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
  const [selectionKey, setSelectionKey] = useState(0);
  const didAutoSelect = useRef(false);

  const selectTruck = useCallback((id: string) => {
    setSelectedId(id);
    setSelectionKey((k) => k + 1);
  }, []);

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

  const sortedFiltered = [...filtered].sort((a, b) => {
    const streetA = a.locations?.street || a.locations?.name || "";
    const streetB = b.locations?.street || b.locations?.name || "";
    return streetA.localeCompare(streetB, "he");
  });

  // Auto-select first truck on initial load
  useEffect(() => {
    if (didAutoSelect.current || loading || sortedFiltered.length === 0) return;
    const firstWithCoords = sortedFiltered.find(
      (t) => t.locations && Number.isFinite(Number(t.locations.lat)) && Number(t.locations.lat) !== 0
    );
    if (firstWithCoords) {
      selectTruck(firstWithCoords.id);
      didAutoSelect.current = true;
    }
  }, [loading, sortedFiltered, selectTruck]);

  // When filter/search changes and selected truck is no longer visible, select the first available
  useEffect(() => {
    if (loading || sortedFiltered.length === 0) {
      if (selectedId) setSelectedId(null);
      return;
    }
    if (selectedId && !sortedFiltered.find((t) => t.id === selectedId)) {
      const firstWithCoords = sortedFiltered.find(
        (t) => t.locations && Number.isFinite(Number(t.locations.lat)) && Number(t.locations.lat) !== 0
      );
      if (firstWithCoords) {
        selectTruck(firstWithCoords.id);
      } else {
        setSelectedId(null);
      }
    }
  }, [sortedFiltered, selectedId, loading, selectTruck]);

  useRegisterList(
    sortedFiltered.map((t) => ({ id: t.id, label: t.truck_name })),
    "/map",
    "/truck/",
    "address"
  );

  const selectedTruck = sortedFiltered.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" dir="rtl">
      {/* Compact toolbar */}
      <div className="bg-card border-b px-4 py-2.5 flex flex-col sm:flex-row items-center gap-2 z-10">
        <div className="flex items-center gap-2 flex-shrink-0">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">מפת כל הפודטראקים</span>
          <span className="text-[11px] text-muted-foreground/60">·</span>
          <span className="text-[11px] text-muted-foreground/60">{sortedFiltered.length} עמדות</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative max-w-[220px]">
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
            <Input
              placeholder="חיפוש מהיר…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8 h-8 text-xs bg-background"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link
            to="/experience"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <Heart className="h-3.5 w-3.5" />
            חוויה מקומית...
          </Link>
          <PageNavigation />
        </div>
      </div>

      {/* Desktop selected-truck detail strip */}
      {selectedTruck && (
        <div className="hidden md:flex bg-card/80 backdrop-blur border-b px-4 py-2 items-center gap-4 z-10 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="w-1.5 h-8 rounded-full bg-primary flex-shrink-0" />
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h3 className="font-bold text-sm text-foreground truncate">{selectedTruck.truck_name}</h3>
            {selectedTruck.food_category && (
              <Badge variant="secondary" className="text-[10px] font-medium flex-shrink-0">
                {selectedTruck.food_category}
              </Badge>
            )}
            {selectedTruck.locations?.name && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3" />
                {selectedTruck.locations.name}
              </span>
            )}
            {selectedTruck.hours_from && selectedTruck.hours_to && (
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1 flex-shrink-0">
                <Clock className="h-3 w-3" />
                {selectedTruck.hours_from} – {selectedTruck.hours_to}
              </span>
            )}
          </div>
          <Link
            to={`/truck/${selectedTruck.id}`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold flex-shrink-0"
          >
            פרטים נוספים
            <ChevronLeft className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Main: map + list */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">טוען מפה…</p>
            </div>
          ) : (
            <TruckMap
              trucks={sortedFiltered}
              selectedTruckId={selectedId}
              onSelectTruck={(t) => selectTruck(t.id)}
              selectionKey={selectionKey}
            />
          )}
        </div>

        {/* Narrow side list */}
        <div className="w-72 hidden md:flex flex-col border-r bg-card overflow-y-auto">
          <div className="p-2.5 border-b">
            <h2 className="font-bold text-xs text-foreground">מה פתוח עכשיו?</h2>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">לחצו על עמדה לצפייה במפה</p>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : sortedFiltered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-2">
                <UtensilsCrossed className="h-6 w-6 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground">לא נמצאו עמדות</p>
                <p className="text-xs text-muted-foreground/60">נסו לשנות את החיפוש</p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {sortedFiltered.map((truck) => (
                <TruckSideCard
                  key={truck.id}
                  truck={truck}
                  selected={truck.id === selectedId}
                  onClick={() => selectTruck(truck.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selectedTruck && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t rounded-t-2xl municipal-shadow-lg p-4 z-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-foreground">{selectedTruck.truck_name}</h3>
              {selectedTruck.food_category && (
                <p className="text-sm text-muted-foreground mt-0.5">{selectedTruck.food_category}</p>
              )}
              {selectedTruck.locations?.name && (
                <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {selectedTruck.locations.name}
                </p>
              )}
              {(selectedTruck.hours_from && selectedTruck.hours_to) && (
                <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  {selectedTruck.hours_from} – {selectedTruck.hours_to}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                to={`/truck/${selectedTruck.id}`}
                className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-center"
              >
                פרטים נוספים
              </Link>
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
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
  const photoUrl = truck.street_photo_2_url || truck.street_photo_1_url || truck.vehicle_photo_url;
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll selected card into view
  useEffect(() => {
    if (selected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selected]);

  return (
    <div
      ref={cardRef}
      className={`p-3 cursor-pointer transition-all duration-200 ${
        selected
          ? "bg-primary/[0.06] border-s-[3px] border-s-primary ring-1 ring-inset ring-primary/10"
          : "hover:bg-muted/30"
      }`}
      onClick={onClick}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={truck.truck_name}
          className={`w-full h-28 object-cover rounded-lg mb-2.5 transition-shadow duration-200 ${
            selected ? "ring-2 ring-primary/30" : ""
          }`}
        />
      ) : (
        <div className="w-full h-24 bg-muted/40 rounded-lg mb-2.5 flex items-center justify-center">
          <UtensilsCrossed className="h-7 w-7 text-muted-foreground/15" />
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm leading-tight text-foreground">{truck.truck_name}</h3>
          {truck.food_category && (
            <Badge variant="secondary" className="text-[10px] shrink-0 font-medium">
              {truck.food_category}
            </Badge>
          )}
        </div>

        {truck.locations?.name && (
          <p className="text-[12px] text-muted-foreground/70 flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {truck.locations.name}
          </p>
        )}

        {truck.hours_from && truck.hours_to && (
          <p className="text-[12px] text-muted-foreground/70 flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            {truck.hours_from} – {truck.hours_to}
          </p>
        )}

        <Link
          to={`/truck/${truck.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center text-[12px] text-primary hover:text-primary/80 font-semibold mt-1"
        >
          תפריט ופרטים נוספים ←
        </Link>
      </div>
    </div>
  );
}
