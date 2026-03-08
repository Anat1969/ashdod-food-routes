import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, UtensilsCrossed } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import type { FoodTruck, Location } from "@/lib/types";

type TruckWithLocation = FoodTruck & { locations: Location | null };

export default function Advertisement() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<TruckWithLocation | null>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*, locations(*)");
      const result = (data as TruckWithLocation[]) || [];
      setTrucks(result);
      if (result.length > 0) setSelectedTruck(result[0]);
      setLoading(false);
    };
    fetchTrucks();
  }, []);

  // Build map URL: if a truck is selected and has coords, center on it; otherwise show Ashdod
  const getMapUrl = () => {
    if (selectedTruck?.locations?.lat && selectedTruck?.locations?.lng) {
      const label = encodeURIComponent(`${selectedTruck.truck_name} - ${selectedTruck.locations.name || "אשדוד"}`);
      return `https://www.google.com/maps?q=${selectedTruck.locations.lat},${selectedTruck.locations.lng}&z=17&output=embed&t=m`;
    }
    if (selectedTruck) {
      const query = encodeURIComponent(`${selectedTruck.truck_name} אשדוד`);
      return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
    }
    return `https://www.google.com/maps?q=31.8044,34.6553&z=13&output=embed`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        טוען...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            <UtensilsCrossed className="inline-block h-7 w-7 ml-2 mb-1" />
            פודטראקים באשדוד
          </h1>
          <p className="text-sm opacity-80 mt-1">לחצו על פודטראק כדי לראות את המיקום והתפריט</p>
        </div>
      </section>

      {trucks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Truck className="h-16 w-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">אין פודטראקים מאושרים כרגע</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row-reverse" style={{ height: "calc(100vh - 180px)" }}>
          {/* Right sidebar – truck cards */}
          <aside className="md:w-[380px] lg:w-[420px] overflow-y-auto border-s bg-muted/30 flex-shrink-0">
            <div className="flex flex-col gap-0">
              {trucks.map((truck) => (
                <TruckSidebarCard
                  key={truck.id}
                  truck={truck}
                  isSelected={selectedTruck?.id === truck.id}
                  onSelect={() => setSelectedTruck(truck)}
                />
              ))}
            </div>
          </aside>

          {/* Left – Dynamic Map + selected truck menu */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            {/* Map */}
            <div className="flex-1 relative">
              <iframe
                ref={mapRef}
                key={getMapUrl()}
                title="מפת פודטראקים באשדוד"
                src={getMapUrl()}
                className="w-full h-full absolute inset-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* Selected truck details bar */}
            {selectedTruck && (
              <div className="border-t bg-card p-4 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold">{selectedTruck.truck_name}</h2>
                  {selectedTruck.food_category && (
                    <Badge variant="secondary" className="text-xs">{selectedTruck.food_category}</Badge>
                  )}
                  {selectedTruck.locations && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedTruck.locations.name}
                      {selectedTruck.locations.street && ` – ${selectedTruck.locations.street}`}
                    </span>
                  )}
                  {(selectedTruck.hours_from || selectedTruck.hours_to) && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedTruck.hours_from && selectedTruck.hours_to
                        ? `${selectedTruck.hours_from} – ${selectedTruck.hours_to}`
                        : selectedTruck.hours_from || selectedTruck.hours_to}
                    </span>
                  )}
                </div>

                {/* Menu / Design mockup */}
                {selectedTruck.design_mockup_url && (
                  <div>
                    <p className="text-sm font-medium mb-1">תפריט / הדמיה</p>
                    <ImageLightbox src={selectedTruck.design_mockup_url} alt="תפריט">
                      {({ onClick }) => (
                        <img
                          onClick={onClick}
                          src={selectedTruck.design_mockup_url!}
                          alt="תפריט"
                          className="max-h-40 rounded-md border cursor-zoom-in"
                        />
                      )}
                    </ImageLightbox>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar card component ── */

function TruckSidebarCard({
  truck,
  isSelected,
  onSelect,
}: {
  truck: TruckWithLocation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-start border-b last:border-b-0 transition-colors overflow-hidden
        ${isSelected ? "bg-accent/20 ring-2 ring-inset ring-accent" : "hover:bg-muted/60"}`}
    >
      {/* Truck photo */}
      <div className="relative h-44 sm:h-48">
        {(truck.street_photo_1_url || truck.vehicle_photo_url) ? (
          <img
            src={(truck.street_photo_1_url || truck.vehicle_photo_url)!}
            alt={truck.truck_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Truck className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Status badge overlay */}
        {isSelected && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-xs shadow">נבחר</Badge>
          </div>
        )}

        {/* Name + location overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{truck.truck_name}</span>
            {truck.food_category && (
              <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-0">
                {truck.food_category}
              </Badge>
            )}
          </div>
          {truck.locations && (
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {truck.locations.name}
              {truck.locations.neighborhood && `, ${truck.locations.neighborhood}`}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
