import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Utensils } from "lucide-react";
import type { FoodTruck } from "@/lib/types";

interface TruckCardProps {
  truck: FoodTruck;
}

export default function TruckCard({ truck }: TruckCardProps) {
  return (
    <Link to={`/truck/${truck.id}`}>
      <Card className="municipal-shadow hover:municipal-shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{truck.name}</CardTitle>
            <StatusBadge status={truck.status} />
          </div>
          <p className="text-sm text-muted-foreground">{truck.operator_name}</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {truck.cuisine && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Utensils className="h-4 w-4 flex-shrink-0" />
              <span>{truck.cuisine}</span>
            </div>
          )}
          {(truck.neighborhood || truck.street_address) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{[truck.neighborhood, truck.street_address].filter(Boolean).join(" – ")}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
