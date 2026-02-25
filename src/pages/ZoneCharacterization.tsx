import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ZONE_PROFILES } from "@/lib/types";
import { Check, X, ChevronDown, MapPin } from "lucide-react";

export default function ZoneCharacterization() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">אפיון אזורים</h1>
      <Card className="municipal-shadow">
        <CardContent className="p-0">
          <div className="flex flex-row overflow-x-auto">
            {ZONE_PROFILES.map((zone) => (
              <div key={zone.name} className="flex-1 min-w-0 border-l last:border-l-0">
                <ZoneCollapsible zone={zone} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ZoneCollapsible({ zone }: { zone: typeof ZONE_PROFILES[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b last:border-b-0">
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
  );
}
