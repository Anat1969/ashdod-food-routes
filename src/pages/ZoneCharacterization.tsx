import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ZONE_PROFILES } from "@/lib/types";
import type { ZoneProfile } from "@/lib/types";
import { Check, X, MapPin, ImagePlus, Loader2 } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ZoneCharacterization() {
  const [zoneImages, setZoneImages] = useState<Record<string, string>>({});
  const [selectedZone, setSelectedZone] = useState<ZoneProfile | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase.from("zone_images").select("zone_name, image_url");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.zone_name] = r.image_url; });
        setZoneImages(map);
      }
    };
    fetchImages();
  }, []);

  const handleImageSaved = (zoneName: string, url: string) => {
    setZoneImages((prev) => ({ ...prev, [zoneName]: url }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">אפיון אזורים</h1>
      <Card className="municipal-shadow">
        <CardContent className="p-0">
          <div className="flex flex-row overflow-x-auto">
            {ZONE_PROFILES.map((zone) => (
              <div key={zone.name} className="flex-1 min-w-0 border-l last:border-l-0">
                <ZoneColumn
                  zone={zone}
                  imageUrl={zoneImages[zone.name] || null}
                  onImageSaved={(url) => handleImageSaved(zone.name, url)}
                  onZoneClick={() => setSelectedZone(zone)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone detail dialog */}
      <Dialog open={!!selectedZone} onOpenChange={(open) => !open && setSelectedZone(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedZone?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedZone?.description}</p>
          </DialogHeader>

          {selectedZone && (
            <div className="space-y-2 mt-2">
              {/* Allowed */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  <Check className="h-5 w-5" />
                  מותר
                </h3>
                {selectedZone.rules.filter(r => r.allowed).map((rule, i) => (
                  <div key={i} className="flex items-start gap-2 bg-primary/5 rounded-md px-3 py-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{rule.category}</span>
                      {rule.note && <span className="text-xs text-muted-foreground mr-1">({rule.note})</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Forbidden */}
              <div className="space-y-1.5 mt-4">
                <h3 className="text-base font-bold text-destructive flex items-center gap-1.5">
                  <X className="h-5 w-5" />
                  אסור
                </h3>
                {selectedZone.rules.filter(r => !r.allowed).map((rule, i) => (
                  <div key={i} className="flex items-start gap-2 bg-destructive/5 rounded-md px-3 py-2">
                    <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{rule.category}</span>
                      {rule.note && <span className="text-xs text-muted-foreground mr-1">({rule.note})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ZoneColumn({
  zone,
  imageUrl,
  onImageSaved,
  onZoneClick,
}: {
  zone: typeof ZONE_PROFILES[number];
  imageUrl: string | null;
  onImageSaved: (url: string) => void;
  onZoneClick: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const filePath = `zones/zone_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("truck-photos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("שגיאה בהעלאת התמונה");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("truck-photos")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from("zone_images")
      .upsert({ zone_name: zone.name, image_url: publicUrl, updated_at: new Date().toISOString() }, { onConflict: "zone_name" });

    if (dbError) {
      toast.error("שגיאה בשמירת התמונה");
    } else {
      toast.success("התמונה נשמרה");
      onImageSaved(publicUrl);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col">
      <div
        className="relative aspect-[4/3] bg-muted/30 border-b cursor-pointer group overflow-hidden"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {imageUrl ? (
          <ImageLightbox src={imageUrl} alt={zone.name}>
            {({ onClick }) => (
              <img src={imageUrl} alt={zone.name} className="w-full h-full object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); onClick(); }} />
            )}
          </ImageLightbox>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            <span className="text-[10px]">{uploading ? "מעלה..." : "הוסף תמונה"}</span>
          </div>
        )}
        {imageUrl && !uploading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ImagePlus className="h-5 w-5 text-white" />
          </div>
        )}
        {uploading && imageUrl && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Zone name button – opens detail dialog */}
      <button
        onClick={onZoneClick}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors text-right group"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <span className="font-medium text-sm group-hover:text-primary transition-colors">{zone.name}</span>
            <span className="text-xs text-muted-foreground mr-2">— {zone.description}</span>
          </div>
        </div>
      </button>
    </div>
  );
}
