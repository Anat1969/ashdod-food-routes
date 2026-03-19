import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, UtensilsCrossed, Plus, Trash2 } from "lucide-react";
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

export default function Advertisement() {
  const [trucks, setTrucks] = useState<TruckWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<TruckWithLocation | null>(null);
  const [menuDialogTruck, setMenuDialogTruck] = useState<TruckWithLocation | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [newItem, setNewItem] = useState<NewItemDraft>({ item_name: "", price: "" });
  const { isAdmin, user } = useAuth();

  // Register list for record navigation — must be before any early return
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
      if (result.length > 0) setSelectedTruck(result[0]);
      setLoading(false);
    };
    fetchTrucks();
  }, []);

  const canEditMenu = (truck: TruckWithLocation | null) => {
    if (!truck) return false;
    return isAdmin || truck.operator_id === user?.id;
  };

  const openMenuDialog = async (truck: TruckWithLocation) => {
    setMenuDialogTruck(truck);
    setMenuLoading(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("truck_id", truck.id)
      .order("sort_order", { ascending: true });
    setMenuItems((data as MenuItem[]) || []);
    setMenuLoading(false);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        טוען...
      </div>
    );
  }

  // Register list for record navigation
  useRegisterList(
    trucks.map((t) => ({ id: t.id, label: t.truck_name })),
    "/advertisement",
    "/truck/",
    "address"
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="premium-hero text-primary-foreground py-8">
        <div className="container mx-auto px-4" dir="rtl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">עמדות אוכל באשדוד</h1>
              <p className="text-sm opacity-70 mt-1">גלו את מגוון העמדות ברחבי העיר — מיקומים, תפריטים ושעות פעילות</p>
            </div>
            <PageNavigation />
          </div>
        </div>
      </section>

      {trucks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Truck className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">אין עמדות פעילות כרגע</p>
            <p className="text-sm mt-1">עמדות מאושרות יופיעו כאן באופן אוטומטי</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row-reverse" style={{ height: "calc(100vh - 180px)" }}>
          {/* Right sidebar */}
          <aside className="md:w-[360px] lg:w-[400px] overflow-y-auto border-s bg-card flex-shrink-0">
            <div className="flex flex-col gap-0">
              {trucks.map((truck) => (
                <TruckSidebarCard
                  key={truck.id}
                  truck={truck}
                  isSelected={selectedTruck?.id === truck.id}
                  onSelect={() => setSelectedTruck(truck)}
                  onPhotoClick={() => openMenuDialog(truck)}
                />
              ))}
            </div>
          </aside>

          {/* Left – Map + details */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex-1 relative">
              <TruckMap
                trucks={trucks}
                selectedTruckId={selectedTruck?.id || null}
                onSelectTruck={(truck) => setSelectedTruck(truck)}
              />
            </div>

            {/* Selected truck bar */}
            {selectedTruck && (
              <div className="border-t bg-card p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">{selectedTruck.truck_name}</h2>
                  {selectedTruck.food_category && (
                    <Badge variant="secondary" className="text-xs">{selectedTruck.food_category}</Badge>
                  )}
                  {selectedTruck.locations && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedTruck.locations.name}
                      {selectedTruck.locations.street && ` — ${selectedTruck.locations.street}`}
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

                {selectedTruck.design_mockup_url && (
                  <div className="mt-3">
                    <ImageLightbox src={selectedTruck.design_mockup_url} alt="תפריט">
                      {({ onClick }) => (
                        <img
                          onClick={onClick}
                          src={selectedTruck.design_mockup_url!}
                          alt="תפריט"
                          className="max-h-36 rounded-md border cursor-zoom-in"
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

      {/* Menu Dialog */}
      <Dialog open={!!menuDialogTruck} onOpenChange={(open) => { if (!open) { setMenuDialogTruck(null); setNewItem({ item_name: "", price: "" }); } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          {/* Header photo */}
          <div className="relative h-36 bg-muted">
            {menuDialogTruck?.street_photo_1_url ? (
              <img src={menuDialogTruck.street_photo_1_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Truck className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 right-4 left-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                {menuDialogTruck?.truck_name}
              </h2>
              {menuDialogTruck?.food_category && (
                <p className="text-xs text-white/70 mt-0.5">{menuDialogTruck.food_category}</p>
              )}
            </div>
          </div>

          <div className="px-5 pb-5 pt-3">
            {menuLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">טוען תפריט...</p>
            ) : (
              <>
                <div className="space-y-0 max-h-[45vh] overflow-y-auto">
                  {menuItems.length === 0 && !canEditMenu(menuDialogTruck!) && (
                    <p className="text-sm text-muted-foreground text-center py-6">אין פריטים בתפריט</p>
                  )}

                  {menuItems.map((item, idx) => (
                    <div key={item.id} className={`flex items-center gap-3 py-2.5 ${idx < menuItems.length - 1 ? 'border-b border-dashed border-border' : ''}`}>
                      {canEditMenu(menuDialogTruck!) ? (
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
                              className="w-16 h-8 text-sm text-center border-0 border-b rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary font-medium"
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
                          <span className="text-sm font-bold tabular-nums">₪{item.price}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {canEditMenu(menuDialogTruck!) && (
                  <div className="mt-3 pt-3 border-t">
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
                    <p className="text-[10px] text-muted-foreground mt-1.5">הקלידו שם ומחיר ולחצו Enter להוספה</p>
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

/* ── Sidebar card ── */
function TruckSidebarCard({
  truck,
  isSelected,
  onSelect,
  onPhotoClick,
}: {
  truck: TruckWithLocation;
  isSelected: boolean;
  onSelect: () => void;
  onPhotoClick: () => void;
}) {
  const photoUrl = truck.street_photo_1_url || truck.vehicle_photo_url;

  return (
    <div
      className={`relative w-full text-start border-b last:border-b-0 transition-colors overflow-hidden
        ${isSelected ? "bg-accent/10 ring-2 ring-inset ring-accent/40" : "hover:bg-muted/40"}`}
    >
      <div className="relative h-44 sm:h-48 cursor-pointer group" onClick={onPhotoClick}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={truck.truck_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Truck className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 rounded-full p-2.5 municipal-shadow">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-[10px] shadow-sm">נבחר</Badge>
          </div>
        )}
      </div>

      <button onClick={onSelect} className="w-full text-start">
        <div className="bg-gradient-to-t from-black/70 to-transparent p-3 pt-2 -mt-12 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{truck.truck_name}</span>
            {truck.food_category && (
              <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-0">
                {truck.food_category}
              </Badge>
            )}
          </div>
          {truck.locations && (
            <p className="text-xs text-white/75 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {truck.locations.name}
              {truck.locations.neighborhood && `, ${truck.locations.neighborhood}`}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
