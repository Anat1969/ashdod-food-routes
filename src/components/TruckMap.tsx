import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
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
  /** Increment to force re-emphasis (flyTo + popup) even if selectedTruckId hasn't changed */
  selectionKey?: number;
}

function hasValidCoords(truck?: TruckWithLocation | null): truck is TruckWithLocation & { locations: Location & { lat: number; lng: number } } {
  if (!truck?.locations) return false;
  const lat = Number(truck.locations.lat);
  const lng = Number(truck.locations.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
}

/** Zoom level at which clustering is fully disabled — markers always individual above this */
const CLUSTER_DISABLE_ZOOM = 17;
/** Zoom level used when flying to a selected marker — must be > CLUSTER_DISABLE_ZOOM */
const SELECTION_ZOOM = 18;

function FlyToSelected({
  truck,
  selectionKey,
  markerRefs,
}: {
  truck: TruckWithLocation | null | undefined;
  selectionKey: number;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!truck?.id) return;
    if (!hasValidCoords(truck)) return;

    const targetLat = Number(truck.locations.lat);
    const targetLng = Number(truck.locations.lng);

    // Close any currently open popups first for clean transition
    map.closePopup();

    // Fly to the marker — zoom past cluster threshold so marker is always individually visible
    map.flyTo([targetLat, targetLng], SELECTION_ZOOM, { duration: 0.7 });

    // After fly completes, open popup for the selected marker
    const timer = setTimeout(() => {
      const marker = markerRefs.current[truck.id];
      if (marker) {
        marker.openPopup();
      }
    }, 800);

    return () => clearTimeout(timer);
    // selectionKey allows parents to force re-trigger even for the same truck
  }, [truck?.id, selectionKey, map]);

  return null;
}

export default function TruckMap({ trucks, selectedTruckId, onSelectTruck, selectionKey = 0 }: TruckMapProps) {
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId);
  const trucksWithCoords = trucks.filter((t) => hasValidCoords(t));
  const markerRefs = useRef<Record<string, L.Marker>>({});

  const setMarkerRef = useCallback((id: string, ref: L.Marker | null) => {
    if (ref) {
      markerRefs.current[id] = ref;
    } else {
      delete markerRefs.current[id];
    }
  }, []);

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
      <FlyToSelected truck={selectedTruck} selectionKey={selectionKey} markerRefs={markerRefs} />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        disableClusteringAtZoom={CLUSTER_DISABLE_ZOOM}
      >
        {trucksWithCoords.map((truck) => (
          <Marker
            key={truck.id}
            position={[Number(truck.locations!.lat), Number(truck.locations!.lng)]}
            icon={truck.id === selectedTruckId ? selectedIcon : defaultIcon}
            ref={(ref) => setMarkerRef(truck.id, ref as unknown as L.Marker | null)}
            eventHandlers={{
              click: () => onSelectTruck(truck),
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => {
                // Don't close popup if this is the selected marker
                if (truck.id !== selectedTruckId) {
                  e.target.closePopup();
                }
              },
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
      </MarkerClusterGroup>
    </MapContainer>
  );
}
