import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FoodTruck, Location } from "@/lib/types";

// Fix default marker icons for leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type TruckWithLocation = FoodTruck & { locations: Location | null };

interface TruckMapProps {
  trucks: TruckWithLocation[];
  selectedTruckId: string | null;
  onSelectTruck: (truck: TruckWithLocation) => void;
}

function FlyToSelected({ truck }: { truck: TruckWithLocation | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (truck?.locations?.lat && truck?.locations?.lng) {
      map.flyTo([Number(truck.locations.lat), Number(truck.locations.lng)], 17, { duration: 1 });
    }
  }, [truck?.id, truck?.locations?.lat, truck?.locations?.lng, map]);
  return null;
}

export default function TruckMap({ trucks, selectedTruckId, onSelectTruck }: TruckMapProps) {
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId);
  const trucksWithCoords = trucks.filter((t) => t.locations?.lat && t.locations?.lng);

  return (
    <MapContainer
      center={[31.8044, 34.6553]}
      zoom={14}
      className="w-full h-full z-0"
      style={{ minHeight: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected truck={selectedTruck} />
      {trucksWithCoords.map((truck) => (
        <Marker
          key={truck.id}
          position={[Number(truck.locations!.lat), Number(truck.locations!.lng)]}
          icon={truck.id === selectedTruckId ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onSelectTruck(truck),
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>
            <div className="text-right font-sans min-w-[140px]" dir="rtl">
              <p className="font-bold text-sm text-foreground">{truck.truck_name}</p>
              {truck.food_category && (
                <p className="text-xs text-muted-foreground mt-0.5">{truck.food_category}</p>
              )}
              {truck.locations?.name && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">{truck.locations.name}</p>
              )}
              {truck.hours_from && truck.hours_to && (
                <p className="text-[11px] text-muted-foreground/50 mt-1">
                  {truck.hours_from} – {truck.hours_to}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
