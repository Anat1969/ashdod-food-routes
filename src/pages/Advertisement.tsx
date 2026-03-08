import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, UtensilsCrossed, Truck } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import type { FoodTruck, Location } from "@/lib/types";

type TruckWithLocation = FoodTruck & { locations: Location | null };

export default function Advertisement() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<TruckWithLocation | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*, locations(*)")
        .eq("status", "approved");
      setTrucks((data as TruckWithLocation[]) || []);
      setLoading(false);
    };
    fetchTrucks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        טוען...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <UtensilsCrossed className="inline-block h-8 w-8 ml-2 mb-1" />
            פודטראקים באשדוד
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            גלו את מגוון הפודטראקים המאושרים ברחבי העיר – מיקומים, תפריטים ושעות פעילות
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {trucks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Truck className="h-16 w-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">אין פודטראקים מאושרים כרגע</p>
            <p className="text-sm mt-1">חזרו בקרוב!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck) => (
              <Card
                key={truck.id}
                className="municipal-shadow hover:municipal-shadow-lg transition-shadow cursor-pointer group overflow-hidden"
                onClick={() => setSelectedTruck(selectedTruck?.id === truck.id ? null : truck)}
              >
                {/* Truck Image */}
                {truck.vehicle_photo_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <ImageLightbox src={truck.vehicle_photo_url} alt={truck.truck_name}>
                      {({ onClick }) => (
                        <img
                          onClick={onClick}
                          src={truck.vehicle_photo_url!}
                          alt={truck.truck_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                        />
                      )}
                    </ImageLightbox>
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <Truck className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {truck.truck_name}
                    {truck.food_category && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {truck.food_category}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Location */}
                  {truck.locations && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{truck.locations.name}</p>
                        {truck.locations.street && (
                          <p className="text-muted-foreground text-xs">{truck.locations.street}</p>
                        )}
                        {truck.locations.neighborhood && (
                          <p className="text-muted-foreground text-xs">{truck.locations.neighborhood}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {(truck.hours_from || truck.hours_to) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>
                        {truck.hours_from && truck.hours_to
                          ? `${truck.hours_from} – ${truck.hours_to}`
                          : truck.hours_from || truck.hours_to}
                      </span>
                    </div>
                  )}

                  {/* Operator */}
                  {truck.operator_name && (
                    <p className="text-xs text-muted-foreground">
                      מפעיל: {truck.operator_name}
                    </p>
                  )}

                  {/* Expanded details */}
                  {selectedTruck?.id === truck.id && (
                    <div className="pt-3 border-t space-y-3 animate-in slide-in-from-top-2 duration-200">
                      {/* Map placeholder with location coordinates */}
                      {truck.locations?.lat && truck.locations?.lng && (
                        <div className="rounded-lg overflow-hidden border">
                          <iframe
                            title={`מפת ${truck.truck_name}`}
                            src={`https://www.google.com/maps?q=${truck.locations.lat},${truck.locations.lng}&z=16&output=embed`}
                            className="w-full h-48"
                            loading="lazy"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {/* Design mockup as menu preview */}
                      {truck.design_mockup_url && (
                        <div>
                          <p className="text-sm font-medium mb-1">תפריט / הדמיה</p>
                          <ImageLightbox src={truck.design_mockup_url} alt="תפריט">
                            <img
                              src={truck.design_mockup_url}
                              alt="תפריט"
                              className="w-full rounded-md border cursor-zoom-in"
                            />
                          </ImageLightbox>
                        </div>
                      )}

                      {/* Street photos */}
                      <div className="grid grid-cols-2 gap-2">
                        {truck.street_photo_1_url && (
                          <ImageLightbox src={truck.street_photo_1_url} alt="תמונת רחוב">
                            <img
                              src={truck.street_photo_1_url}
                              alt="תמונת רחוב"
                              className="w-full h-24 object-cover rounded-md border cursor-zoom-in"
                            />
                          </ImageLightbox>
                        )}
                        {truck.street_photo_2_url && (
                          <ImageLightbox src={truck.street_photo_2_url} alt="תמונת רחוב">
                            <img
                              src={truck.street_photo_2_url}
                              alt="תמונת רחוב"
                              className="w-full h-24 object-cover rounded-md border cursor-zoom-in"
                            />
                          </ImageLightbox>
                        )}
                      </div>

                      {truck.locations && (
                        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 rounded-md p-2">
                          <p className="font-medium text-foreground">פרטי מיקום</p>
                          {truck.locations.location_type && <p>סוג: {truck.locations.location_type}</p>}
                          {truck.locations.gush && <p>גוש: {truck.locations.gush}</p>}
                          {truck.locations.chelka && <p>חלקה: {truck.locations.chelka}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
