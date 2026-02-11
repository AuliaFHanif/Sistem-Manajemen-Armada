import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet Icon Fix for React/Vite ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// NEW: Helper to create a colored SVG icon matching your UI
const createColoredIcon = (color: string) => {
  const svgHtml = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
            fill="${color}" 
            stroke="white" 
            stroke-width="1.5"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-marker-container",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface FleetMapProps {
  vehicles: any[];
  included: any[];
  selectedRouteId: string;
}

function MapAutoBounds({
  vehicles,
  selectedRouteId,
}: {
  vehicles: any[];
  selectedRouteId: string;
}) {
  const map = useMap();
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  useEffect(() => {
    // LOGIC: If we have vehicles, zoom to fit them
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.attributes.latitude, v.attributes.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
    // LOGIC: If no vehicles found for a specific route, reset to city view
    else if (selectedRouteId !== "") {
      map.setView(defaultCenter, 12, { animate: true });
    }
  }, [selectedRouteId, map]); // Only trigger on route change

  return null;
}

function RecenterButton({ vehicles }: { vehicles: any[] }) {
  const map = useMap();
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  const handleRecenter = () => {
    if (vehicles.length > 0) {
      // If there are vehicles, zoom to fit them
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.attributes.latitude, v.attributes.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      // Otherwise, go back to the default city view
      map.setView(defaultCenter, 12, { animate: true });
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right mb-6 mr-6">
      <div className="leaflet-control">
        <button
          onClick={handleRecenter}
          className="bg-white hover:bg-gray-50 text-[#003366] p-3 rounded-full shadow-2xl border border-gray-200 flex items-center justify-center transition-all active:scale-90 group"
          title="Recenter Map"
        >
          {/* A simple 'Target' icon using SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.106-1.789L9 1m0 19l6-3m-6 3V1m6 16l5.447 2.724A2 2 0 0021 17.618V7.882a2 2 0 00-1.106-1.789L15 3m0 14V3m0 0L9 1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function FleetMap({
  vehicles,
  included,
  selectedRouteId,
}: FleetMapProps) {
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  return (
    <div className="w-full h-[calc(100vh-300px)] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ADD THIS HERE: It listens to vehicle changes and moves the camera */}
        <MapAutoBounds vehicles={vehicles} selectedRouteId={selectedRouteId} />
        <RecenterButton vehicles={vehicles} />
        {vehicles.map((v) => {
          const routeId = v.relationships.route.data?.id;
          const route = included.find(
            (i) => i.type === "route" && i.id === routeId,
          );
          const color = route?.attributes.color
            ? `#${route.attributes.color}`
            : "#003366";
          const position: [number, number] = [
            v.attributes.latitude,
            v.attributes.longitude,
          ];

          return (
            <Marker
              key={v.id}
              position={position}
              icon={createColoredIcon(color)}
              // NEW: Zoom in when the marker is clicked
              eventHandlers={{
                click: (e) => {
                  const map = e.target._map;
                  map.flyTo(position, 16, {
                    // 16 is a close-up zoom level
                    duration: 1.5,
                  });
                },
              }}
            >
              <Popup>{/* Your existing popup content */}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
