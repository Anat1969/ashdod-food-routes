import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Pane } from "react-leaflet";
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

// Selected marker: larger red icon so it stands out clearly
const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
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
type TruckMapFocusMode = "default" | "advertisement";

interface TruckMapProps {
  trucks: TruckWithLocation[];
  selectedTruckId: string | null;
  onSelectTruck: (truck: TruckWithLocation) => void;
  /** Increment to force re-emphasis (flyTo + popup) even if selectedTruckId hasn't changed */
  selectionKey?: number;
  /** Override the zoom level used when flying to a selected marker */
  selectionZoom?: number;
  /** Override the max zoom when fitting all markers on first load */
  initialZoom?: number;
  /** Which side the sidebar/list panel is on — controls offset direction. Default 'right' for /map layout. */
  sidebarPosition?: "left" | "right";
  /** Width of the sidebar in pixels — used for centering offset. Default 288. */
  sidebarWidth?: number;
  /** Screen-specific framing behavior. Keep /map on default; use advertisement for split-view discovery framing. */
  focusMode?: TruckMapFocusMode;
}

export function hasValidCoords(
  truck?: TruckWithLocation | null
): truck is TruckWithLocation & {
  locations: Location & { lat: number; lng: number };
} {
  if (!truck?.locations) return false;
  const lat = Number(truck.locations.lat);
  const lng = Number(truck.locations.lng);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat !== 0 &&
    lng !== 0 &&
    Number.isFinite(Number(truck.locations.lng)) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

/** Zoom level at which clustering is fully disabled */
const CLUSTER_DISABLE_ZOOM = 17;
/** Zoom level used when flying to a selected marker — close street-level */
const SELECTION_ZOOM = 18;
/** Max zoom when fitting all markers on first load */
const INITIAL_ZOOM = 16;

function getAdvertisementAnchorPoint(mapSize: L.Point): L.Point {
  const isCompact = mapSize.y < 340;
  const isNarrow = mapSize.x < 640;

  return L.point(
    mapSize.x * (isNarrow ? 0.5 : 0.56),
    mapSize.y * (isCompact ? 0.78 : 0.72)
  );
}

function getFramedCenterPoint({
  focusMode,
  map,
  selectionZoom,
  sidebarPosition,
  sidebarWidth,
  targetLat,
  targetLng,
}: {
  focusMode: TruckMapFocusMode;
  map: L.Map;
  selectionZoom: number;
  sidebarPosition: "left" | "right";
  sidebarWidth: number;
  targetLat: number;
  targetLng: number;
}) {
  const mapSize = map.getSize();
  const targetPoint = map.project([targetLat, targetLng], selectionZoom);

  if (focusMode === "advertisement") {
    const desiredMarkerPoint = getAdvertisementAnchorPoint(mapSize);
    const viewportCenter = L.point(mapSize.x / 2, mapSize.y / 2);
    const markerOffset = desiredMarkerPoint.subtract(viewportCenter);

    return L.point(targetPoint.x - markerOffset.x, targetPoint.y - markerOffset.y);
  }

  const halfSidebar = mapSize.x > 800 ? sidebarWidth / 2 : 0;
  const popupOffsetY = mapSize.y > 400 ? -40 : 0;
  const offsetX = sidebarPosition === "right" ? -halfSidebar : halfSidebar;

  return L.point(targetPoint.x + offsetX, targetPoint.y + popupOffsetY);
}

/**
 * Compute a tiny lat/lng offset for trucks sharing exact coordinates
 * so they don't perfectly overlap and become indistinguishable.
 */
function computeOffsets(trucks: TruckWithLocation[]): Record<string, [number, number]> {
  const groups: Record<string, string[]> = {};
  for (const t of trucks) {
    if (!hasValidCoords(t)) continue;
    const key = `${Number(t.locations.lat).toFixed(8)},${Number(t.locations.lng).toFixed(8)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t.id);
  }
  const offsets: Record<string, [number, number]> = {};
  for (const ids of Object.values(groups)) {
    if (ids.length <= 1) continue;
    const radius = 0.00003;
    ids.forEach((id, i) => {
      const angle = (2 * Math.PI * i) / ids.length;
      offsets[id] = [Math.cos(angle) * radius, Math.sin(angle) * radius];
    });
  }
  return offsets;
}

function FlyToSelected({
  truck,
  selectionKey,
  markerRefs,
  offsets,
  selectionZoom,
  sidebarPosition,
  sidebarWidth,
  focusMode,
}: {
  truck: TruckWithLocation | null | undefined;
  selectionKey: number;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
  offsets: Record<string, [number, number]>;
  selectionZoom: number;
  sidebarPosition: "left" | "right";
  sidebarWidth: number;
  focusMode: TruckMapFocusMode;
}) {
  const map = useMap();

  useEffect(() => {
    if (!truck?.id) return;
    if (!hasValidCoords(truck)) return;

    const offset = offsets[truck.id] || [0, 0];
    const targetLat = Number(truck.locations.lat) + offset[0];
    const targetLng = Number(truck.locations.lng) + offset[1];

    map.closePopup();

    const adjustedPoint = getFramedCenterPoint({
      focusMode,
      map,
      selectionZoom,
      sidebarPosition,
      sidebarWidth,
      targetLat,
      targetLng,
    });
    const adjustedLatLng = map.unproject(adjustedPoint, selectionZoom);

    map.flyTo(adjustedLatLng, selectionZoom, {
      duration: focusMode === "advertisement" ? 0.45 : 0.5,
      easeLinearity: 0.25,
    });

    // Open popup reliably after moveend, not just a timer
    const openPopup = () => {
      const marker = markerRefs.current[truck.id];
      if (marker) marker.openPopup();
    };

    const onMoveEnd = () => {
      openPopup();
      map.off("moveend", onMoveEnd);
    };
    map.on("moveend", onMoveEnd);
    const fallback = setTimeout(() => {
      map.off("moveend", onMoveEnd);
      openPopup();
    }, 1000);

    return () => {
      clearTimeout(fallback);
      map.off("moveend", onMoveEnd);
    };
  }, [truck?.id, selectionKey, focusMode, map, offsets, selectionZoom, sidebarPosition, sidebarWidth]);

  return null;
}

/** On first mount, fit bounds to all markers so the initial view is meaningful */
function FitBoundsOnMount({
  trucks,
  offsets,
  initialZoom,
  sidebarPosition,
  sidebarWidth,
  focusMode,
  selectedTruck,
}: {
  trucks: TruckWithLocation[];
  offsets: Record<string, [number, number]>;
  initialZoom: number;
  sidebarPosition: "left" | "right";
  sidebarWidth: number;
  focusMode: TruckMapFocusMode;
  selectedTruck: TruckWithLocation | null | undefined;
}) {
  const map = useMap();
  const [fitted, setFitted] = useState(false);

  useEffect(() => {
    if (focusMode === "advertisement" && hasValidCoords(selectedTruck)) {
      setFitted(true);
      return;
    }

    if (fitted || trucks.length === 0) return;
    const points = trucks
      .filter(hasValidCoords)
      .map((t) => {
        const o = offsets[t.id] || [0, 0];
        return L.latLng(Number(t.locations.lat) + o[0], Number(t.locations.lng) + o[1]);
      });
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    const pad = sidebarWidth + 20;
    const paddingLeft = sidebarPosition === "left" ? pad : 20;
    const paddingRight = sidebarPosition === "right" ? pad : 20;
    map.fitBounds(bounds, {
      paddingTopLeft: [paddingLeft, 20],
      paddingBottomRight: [paddingRight, 20],
      maxZoom: initialZoom,
    });
    setFitted(true);
  }, [trucks, fitted, focusMode, map, offsets, initialZoom, selectedTruck, sidebarPosition, sidebarWidth]);

  return null;
}

export default function TruckMap({
  trucks,
  selectedTruckId,
  onSelectTruck,
  selectionKey = 0,
  selectionZoom: selectionZoomProp,
  initialZoom: initialZoomProp,
  sidebarPosition = "right",
  sidebarWidth = 288,
  focusMode = "default",
}: TruckMapProps) {
  const effectiveSelectionZoom = selectionZoomProp ?? SELECTION_ZOOM;
  const effectiveInitialZoom = initialZoomProp ?? INITIAL_ZOOM;
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId);
  const trucksWithCoords = trucks.filter((t) => hasValidCoords(t));
  const markerRefs = useRef<Record<string, L.Marker>>({});

  // Compute stable offsets for overlapping coordinates
  const offsets = useMemo(() => computeOffsets(trucksWithCoords), [trucksWithCoords]);

  const setMarkerRef = useCallback((id: string, ref: L.Marker | null) => {
    if (ref) {
      markerRefs.current[id] = ref;
    } else {
      delete markerRefs.current[id];
    }
  }, []);

  // Non-selected trucks go in cluster; selected truck rendered separately on top
  const nonSelectedTrucks = trucksWithCoords.filter((t) => t.id !== selectedTruckId);

  const getPosition = useCallback(
    (truck: TruckWithLocation): [number, number] => {
      const offset = offsets[truck.id] || [0, 0];
      return [Number(truck.locations!.lat) + offset[0], Number(truck.locations!.lng) + offset[1]];
    },
    [offsets]
  );

  return (
    <MapContainer
      center={[31.8044, 34.6553]}
      zoom={effectiveInitialZoom}
      className="w-full h-full z-0"
      style={{ minHeight: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBoundsOnMount
        trucks={trucksWithCoords}
        offsets={offsets}
        initialZoom={effectiveInitialZoom}
        sidebarPosition={sidebarPosition}
        sidebarWidth={sidebarWidth}
        focusMode={focusMode}
        selectedTruck={selectedTruck}
      />
      <FlyToSelected
        truck={selectedTruck}
        selectionKey={selectionKey}
        markerRefs={markerRefs}
        offsets={offsets}
        selectionZoom={effectiveSelectionZoom}
        sidebarPosition={sidebarPosition}
        sidebarWidth={sidebarWidth}
        focusMode={focusMode}
      />

      {/* Non-selected markers in cluster group */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        disableClusteringAtZoom={CLUSTER_DISABLE_ZOOM}
      >
        {nonSelectedTrucks.map((truck) => (
          <Marker
            key={truck.id}
            position={getPosition(truck)}
            icon={defaultIcon}
            ref={(ref) => setMarkerRef(truck.id, ref as unknown as L.Marker | null)}
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
      </MarkerClusterGroup>

      {/* Selected marker rendered OUTSIDE cluster group — always visible on top */}
      {selectedTruck && hasValidCoords(selectedTruck) && (
        <Marker
          position={getPosition(selectedTruck)}
          icon={selectedIcon}
          zIndexOffset={1000}
          ref={(ref) => setMarkerRef(selectedTruck.id, ref as unknown as L.Marker | null)}
          eventHandlers={{
            click: () => onSelectTruck(selectedTruck),
            mouseover: (e) => e.target.openPopup(),
            mouseout: () => {
              /* keep popup open for selected */
            },
          }}
        >
          <Popup
            keepInView={focusMode === "advertisement"}
            autoPan={focusMode === "advertisement"}
            autoPanPaddingTopLeft={focusMode === "advertisement" ? L.point(28, 72) : undefined}
            autoPanPaddingBottomRight={focusMode === "advertisement" ? L.point(28, 32) : undefined}
          >
            <div className="text-right font-sans min-w-[160px]" dir="rtl">
              <p className="font-bold text-sm text-foreground">{selectedTruck.truck_name}</p>
              {selectedTruck.food_category && (
                <p className="text-xs text-muted-foreground mt-0.5">{selectedTruck.food_category}</p>
              )}
              {selectedTruck.locations?.name && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">{selectedTruck.locations.name}</p>
              )}
              {selectedTruck.hours_from && selectedTruck.hours_to && (
                <p className="text-[11px] text-muted-foreground/50 mt-1">
                  {selectedTruck.hours_from} – {selectedTruck.hours_to}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
