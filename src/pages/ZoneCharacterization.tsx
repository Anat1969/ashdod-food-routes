import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ZONE_PROFILES } from "@/lib/types";
import { Check, X, ChevronDown, MapPin, ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ZoneCharacterization() {
  const [zoneImages, setZoneImages] = useState<Record<string, string>>({});

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
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ZoneColumn({
  zone,
  imageUrl,
  onImageSaved,
}: {
  zone: typeof ZONE_PROFILES[number];
  imageUrl: string | null;
  onImageSaved: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const filePath = `zones/${zone.name}_${Date.now()}.${ext}`;

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
          <img src={imageUrl} alt={zone.name} className="w-full h-full object-cover" />
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

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors text-right">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <span className="font-medium text-sm">{zone.name}</span>
                <span className="text-xs text-muted-foreground mr-2">— {zone.description}</span>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-3 space-y-1.5">
            {zone.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {rule.allowed ? (
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <span>
                  {rule.category}
                  {rule.note && <span className="text-xs text-muted-foreground mr-1">({rule.note})</span>}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
