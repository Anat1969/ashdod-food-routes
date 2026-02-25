import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ZONE_PROFILES } from "@/lib/types";
import { Check, X, ChevronDown, MapPin, ImagePlus } from "lucide-react";

export default function ZoneCharacterization() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">אפיון אזורים</h1>
      <Card className="municipal-shadow">
        <CardContent className="p-0">
          <div className="flex flex-row overflow-x-auto">
            {ZONE_PROFILES.map((zone) => (
              <div key={zone.name} className="flex-1 min-w-0 border-l last:border-l-0">
                <ZoneColumn zone={zone} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ZoneColumn({ zone }: { zone: typeof ZONE_PROFILES[number] }) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col">
      {/* Image slot aligned with the zone button */}
      <div
        className="relative aspect-[4/3] bg-muted/30 border-b cursor-pointer group overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={zone.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px]">הוסף תמונה</span>
          </div>
        )}
        {imageUrl && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ImagePlus className="h-5 w-5 text-white" />
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

      {/* Collapsible zone info */}
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
