import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Save, Loader2 } from "lucide-react";
import MapPicker from "./MapPicker";

interface LocationEditorProps {
  locationId: string;
  currentLat: number | null;
  currentLng: number | null;
  locationName: string;
  onSaved: () => void;
}

export default function LocationEditor({ locationId, currentLat, currentLng, locationName, onSaved }: LocationEditorProps) {
  const [lat, setLat] = useState<string>(currentLat?.toString() ?? "");
  const [lng, setLng] = useState<string>(currentLng?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLat(currentLat?.toString() ?? "");
    setLng(currentLng?.toString() ?? "");
  }, [currentLat, currentLng]);

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0;
  const hasChanged = hasValidCoords && (parsedLat !== currentLat || parsedLng !== currentLng);

  const handleMapClick = (newLat: number, newLng: number) => {
    setLat(newLat.toFixed(6));
    setLng(newLng.toFixed(6));
  };

  const handleSave = async () => {
    if (!hasValidCoords) {
      toast.error("יש להזין קואורדינטות תקינות");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("locations")
      .update({ lat: parsedLat, lng: parsedLng })
      .eq("id", locationId);
    setSaving(false);

    if (error) {
      toast.error("שגיאה בשמירת המיקום");
      console.error(error);
      return;
    }
    toast.success("המיקום עודכן בהצלחה");
    onSaved();
  };

  return (
    <Card className="municipal-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          עדכון מיקום — {locationName}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          עדכנו את הקואורדינטות ידנית או בחרו נקודה על המפה
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current status */}
        {currentLat && currentLng ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>מיקום נוכחי: {currentLat.toFixed(6)}, {currentLng.toFixed(6)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>מיקום לא הוגדר — בחרו נקודה על המפה או הזינו קואורדינטות</span>
          </div>
        )}

        {/* Manual lat/lng inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">קו רוחב (Lat)</Label>
            <Input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="31.8044"
              className="h-9 text-sm font-mono tabular-nums"
              type="number"
              step="0.000001"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">קו אורך (Lng)</Label>
            <Input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="34.6553"
              className="h-9 text-sm font-mono tabular-nums"
              type="number"
              step="0.000001"
            />
          </div>
        </div>

        {/* Map picker */}
        <MapPicker
          lat={hasValidCoords ? parsedLat : null}
          lng={hasValidCoords ? parsedLng : null}
          onChange={handleMapClick}
        />

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanged || saving}
          className="w-full"
          size="sm"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 ml-2" />
          )}
          {saving ? "שומר…" : "שמור מיקום"}
        </Button>
      </CardContent>
    </Card>
  );
}
