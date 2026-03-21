import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, UtensilsCrossed, Plus, Trash2, MapPinOff, ImageOff } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageLightbox from "@/components/ImageLightbox";
import TruckMap from "@/components/TruckMap";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { FoodTruck, Location } from "@/lib/types";
import PageNavigation from "@/components/PageNavigation";
import { useRegisterList } from "@/hooks/useListNavigation";

type TruckWithLocation = FoodTruck & { locations: Location | null };

interface NewItemDraft {
  item_name: string;
  price: string;
}

interface MenuItem {
  id: string;
  truck_id: string;
  item_name: string;
  price: number;
  sort_order: number;
}

/** Check if a truck has usable map coordinates */
function hasValidCoords(truck: TruckWithLocation | null | undefined): boolean {
  if (!truck?.locations) return false;
  const lat = Number(truck.locations.lat);
  const lng = Number(truck.locations.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
}

/** Get the best available photo URL for a truck — vehicle photo first for catalog feel */
function getTruckPhoto(truck: TruckWithLocation | null | undefined): string | null {
  if (!truck) return null;
  return truck.vehicle_photo_url || truck.street_photo_1_url || null;
}

export default function Advertisement() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [menuDialogTruckId, setMenuDialogTruckId] = useState<string | null>(null);
  const [selectionKey, setSelectionKey] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [newItem, setNewItem] = useState<NewItemDraft>({ item_name: "", price: "" });
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const { isAdmin, user } = useAuth();

  // Derive selected truck from ID — single source of truth
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) ?? null;
  const menuDialogTruck = trucks.find((t) => t.id === menuDialogTruckId) ?? null;

  useRegisterList(
    trucks.map((t) => ({ id: t.id, label: t.truck_name })),
    "/advertisement",
    "/truck/",
    "address"
  );

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data } = await supabase
        .from("food_trucks")
        .select("*, locations(*)");
      const result = (data as TruckWithLocation[]) || [];
      result.sort((a, b) => {
        const streetA = a.locations?.street || a.locations?.name || "";
        const streetB = b.locations?.street || b.locations?.name || "";
        return streetA.localeCompare(streetB, "he");
      });
      setTrucks(result);
      if (result.length > 0) setSelectedTruckId(result[0].id);
      setLoading(false);
    };
    fetchTrucks();
  }, []);

  const canEditMenu = (truck: TruckWithLocation | null) => {
    if (!truck) return false;
    return isAdmin || truck.operator_id === user?.id;
  };

  const handleSelectTruck = useCallback((truckOrId: TruckWithLocation | string) => {
    const id = typeof truckOrId === "string" ? truckOrId : truckOrId.id;
    setSelectedTruckId(id);
    setSelectionKey((k) => k + 1);
  }, []);

  const openMenuDialog = useCallback(async (truckId: string) => {
    // Always select the truck first — single source of truth
    setSelectedTruckId(truckId);
    setMenuDialogTruckId(truckId);
    setMenuLoading(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("truck_id", truckId)
      .order("sort_order", { ascending: true });
    setMenuItems((data as MenuItem[]) || []);
    setMenuLoading(false);
  }, []);

  const closeMenuDialog = useCallback(() => {
    setMenuDialogTruckId(null);
    setMenuItems([]);
    setNewItem({ item_name: "", price: "" });
    // Re-emphasize the selected truck on the map after dialog closes
    setSelectionKey((k) => k + 1);
  }, []);

  const addMenuItem = async () => {
    if (!menuDialogTruck || !newItem.item_name.trim()) return;
    const price = parseFloat(newItem.price) || 0;
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        truck_id: menuDialogTruck.id,
        item_name: newItem.item_name.trim(),
        price,
        sort_order: menuItems.length,
      })
      .select()
      .single();
    if (error) { toast.error("שגיאה בהוספת פריט"); return; }
    setMenuItems([...menuItems, data as MenuItem]);
    setNewItem({ item_name: "", price: "" });
  };

  const updateMenuItem = async (id: string, field: string, value: string | number) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    await supabase.from("menu_items").update({ [field]: value }).eq("id", id);
  };

  const deleteMenuItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success("פריט נמחק");
  };

  const handleImgError = useCallback((url: string) => {
    setImgErrors((prev) => new Set(prev).add(url));
  }, []);

  /** Check if a photo URL is usable (exists and hasn't errored) */
  const isPhotoUsable = useCallback((url: string | null | undefined): url is string => {
    return !!url && !imgErrors.has(url);
  }, [imgErrors]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">טוען עמדות…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — discovery-focused, inviting */}
      <section className="premium-hero-deep text-primary-foreground">
        <div className="container mx-auto px-4 py-6" dir="rtl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">גלו, השוו ובחרו</h1>
              <p className="text-sm text-primary-foreground/50 mt-1.5 leading-relaxed max-w-md">
                עיינו בתפריטים, צפו בתמונות ובחרו את העמדה שמתאימה לכם — הכל במקום אחד
              </p>
            </div>
            <PageNavigation />
          </div>
        </div>
      </section>

      {trucks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-xs">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">אין עמדות פעילות כרגע</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                עמדות מאושרות יופיעו כאן באופן אוטומטי
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row-reverse" style={{ height: "calc(100vh - 140px)" }}>
          {/* Right sidebar */}
          <aside className="md:w-[370px] lg:w-[420px] overflow-y-auto border-s bg-background flex-shrink-0">
            <div className="p-3 border-b bg-card">
              <p className="text-[11px] font-semibold text-muted-foreground/60 tracking-wide">
                קטלוג · {trucks.length} עמדות
              </p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">לחצו על תמונה לצפייה בתפריט</p>
            </div>
            <div className="flex flex-col gap-0">
              {trucks.map((truck) => (
                <TruckSidebarCard
                  key={truck.id}
                  truck={truck}
                  isSelected={selectedTruckId === truck.id}
                  onSelect={() => handleSelectTruck(truck.id)}
                  onPhotoClick={() => openMenuDialog(truck.id)}
                  isPhotoUsable={isPhotoUsable}
                  onImgError={handleImgError}
                />
              ))}
            </div>
          </aside>

          {/* Left – Map + details */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex-1 relative">
              <TruckMap
                trucks={trucks}
                selectedTruckId={selectedTruckId}
                onSelectTruck={(truck) => handleSelectTruck(truck.id)}
                selectionKey={selectionKey}
              />
            </div>

            {/* Selected truck detail bar */}
            {selectedTruck && (
              <div className="border-t bg-card p-4" dir="rtl">
                <div className="flex items-start gap-4">
                  {/* Photo thumbnail with error handling */}
                  {(() => {
                    const photoUrl = getTruckPhoto(selectedTruck);
                    if (photoUrl && isPhotoUsable(photoUrl)) {
                      return (
                        <img
                          src={photoUrl}
                          alt={selectedTruck.truck_name}
                          className="w-16 h-16 rounded-xl object-cover border flex-shrink-0"
                          onError={() => handleImgError(photoUrl)}
                        />
                      );
                    }
                    return (
                      <div className="w-16 h-16 rounded-xl border bg-muted/40 flex items-center justify-center flex-shrink-0">
                        <ImageOff className="h-5 w-5 text-muted-foreground/25" />
                      </div>
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-foreground">{selectedTruck.truck_name}</h2>
                      {selectedTruck.food_category && (
                        <Badge variant="secondary" className="text-[11px]">{selectedTruck.food_category}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {selectedTruck.locations ? (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          {hasValidCoords(selectedTruck) ? (
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          ) : (
                            <MapPinOff className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
                          )}
                          {selectedTruck.locations.name}
                          {selectedTruck.locations.street && ` · ${selectedTruck.locations.street}`}
                          {!hasValidCoords(selectedTruck) && (
                            <span className="text-xs text-muted-foreground/50 mr-1">(מיקום לא נקבע)</span>
                          )}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground/50">
                          <MapPinOff className="h-3.5 w-3.5 flex-shrink-0" />
                          מיקום לא הוגדר
                        </span>
                      )}
                      {(selectedTruck.hours_from || selectedTruck.hours_to) && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                          {selectedTruck.hours_from && selectedTruck.hours_to
                            ? `${selectedTruck.hours_from} – ${selectedTruck.hours_to}`
                            : selectedTruck.hours_from || selectedTruck.hours_to}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTruck.design_mockup_url && isPhotoUsable(selectedTruck.design_mockup_url) && (
                  <div className="mt-3">
                    <ImageLightbox src={selectedTruck.design_mockup_url} alt="תפריט">
                      {({ onClick }) => (
                        <img
                          onClick={onClick}
                          src={selectedTruck.design_mockup_url!}
                          alt="תפריט"
                          className="max-h-32 rounded-lg border cursor-zoom-in"
                          onError={() => handleImgError(selectedTruck.design_mockup_url!)}
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

      {/* Menu Dialog — premium catalog style */}
      <Dialog open={!!menuDialogTruck} onOpenChange={(open) => { if (!open) closeMenuDialog(); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl" dir="rtl">
          {/* Header photo with overlay */}
          <div className="relative h-40 bg-muted">
            {(() => {
              const photoUrl = getTruckPhoto(menuDialogTruck);
              if (photoUrl && isPhotoUsable(photoUrl)) {
                return (
                  <img
                    src={photoUrl}
                    alt={menuDialogTruck?.truck_name || ""}
                    className="w-full h-full object-cover"
                    onError={() => handleImgError(photoUrl)}
                  />
                );
              }
              return (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <UtensilsCrossed className="h-10 w-10 text-muted-foreground/20" />
                </div>
              );
            })()}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 right-5 left-5">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {menuDialogTruck?.truck_name}
              </h2>
              {menuDialogTruck?.food_category && (
                <p className="text-[13px] text-white/60 mt-0.5">{menuDialogTruck.food_category}</p>
              )}
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            <p className="text-[11px] font-semibold text-muted-foreground/50 tracking-wide uppercase mb-3">תפריט</p>

            {menuLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">טוען תפריט…</p>
              </div>
            ) : (
              <>
                <div className="space-y-0 max-h-[45vh] overflow-y-auto">
                  {menuItems.length === 0 && !canEditMenu(menuDialogTruck) && (
                    <div className="text-center py-8">
                      <UtensilsCrossed className="h-6 w-6 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">התפריט טרם הוזן</p>
                    </div>
                  )}

                  {menuItems.map((item, idx) => (
                    <div key={item.id} className={`flex items-center gap-3 py-3 ${idx < menuItems.length - 1 ? 'border-b border-border/50' : ''}`}>
                      {canEditMenu(menuDialogTruck) ? (
                        <>
                          <Input
                            className="flex-1 h-8 text-sm border-0 border-b rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                            value={item.item_name}
                            onChange={(e) => updateMenuItem(item.id, "item_name", e.target.value)}
                            placeholder="שם המנה"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">₪</span>
                            <Input
                              className="w-16 h-8 text-sm text-center border-0 border-b rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary font-semibold"
                              type="number"
                              value={item.price}
                              onChange={(e) => updateMenuItem(item.id, "price", parseFloat(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => deleteMenuItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{item.item_name}</span>
                          <span className="text-sm font-bold tabular-nums text-foreground">₪{item.price}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {canEditMenu(menuDialogTruck) && (
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Input
                        className="flex-1 h-9 text-sm"
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                        placeholder="שם המנה..."
                        onKeyDown={(e) => e.key === "Enter" && addMenuItem()}
                      />
                      <Input
                        className="w-20 h-9 text-sm text-center"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="מחיר"
                        onKeyDown={(e) => e.key === "Enter" && addMenuItem()}
                      />
                      <Button size="sm" className="h-9 px-3 flex-shrink-0" onClick={addMenuItem} disabled={!newItem.item_name.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">הקלידו שם ומחיר ולחצו Enter</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Sidebar card — premium tile ── */
function TruckSidebarCard({
  truck,
  isSelected,
  onSelect,
  onPhotoClick,
  isPhotoUsable,
  onImgError,
}: {
  truck: TruckWithLocation;
  isSelected: boolean;
  onSelect: () => void;
  onPhotoClick: () => void;
  isPhotoUsable: (url: string | null | undefined) => url is string;
  onImgError: (url: string) => void;
}) {
  const photoUrl = getTruckPhoto(truck);
  const showPhoto = isPhotoUsable(photoUrl);

  return (
    <div
      className={`relative w-full text-start border-b last:border-b-0 transition-all duration-200 overflow-hidden
        ${isSelected ? "bg-accent/[0.06] border-s-[3px] border-s-accent" : "hover:bg-muted/30"}`}
    >
      <div className="relative h-40 cursor-pointer group" onClick={onPhotoClick}>
        {showPhoto ? (
          <img
            src={photoUrl}
            alt={truck.truck_name}
            className="w-full h-full object-cover"
            onError={() => onImgError(photoUrl)}
          />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm rounded-full p-2.5 municipal-shadow">
            <UtensilsCrossed className="h-4 w-4 text-accent" />
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-[10px] shadow-sm font-semibold">נבחר</Badge>
          </div>
        )}
      </div>

      <button onClick={onSelect} className="w-full text-start">
        <div className="bg-gradient-to-t from-black/75 via-black/40 to-transparent p-3 pt-3 -mt-14 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">{truck.truck_name}</span>
            {truck.food_category && (
              <Badge variant="secondary" className="text-[10px] bg-white/15 text-white/80 border-0 font-medium">
                {truck.food_category}
              </Badge>
            )}
          </div>
          {truck.locations ? (
            <p className="text-[12px] text-white/60 flex items-center gap-1 mt-0.5">
              {hasValidCoords(truck) ? (
                <MapPin className="h-3 w-3 flex-shrink-0" />
              ) : (
                <MapPinOff className="h-3 w-3 flex-shrink-0 opacity-50" />
              )}
              {truck.locations.name}
              {truck.locations.neighborhood && ` · ${truck.locations.neighborhood}`}
            </p>
          ) : (
            <p className="text-[12px] text-white/40 flex items-center gap-1 mt-0.5">
              <MapPinOff className="h-3 w-3 flex-shrink-0" />
              מיקום לא הוגדר
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
