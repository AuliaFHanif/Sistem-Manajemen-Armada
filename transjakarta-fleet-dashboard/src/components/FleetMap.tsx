import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Perbaiki ikon Leaflet default yang hilang di Vite
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  selectedRouteIds: string[];
}

// Komponen MapAutoBounds - untuk otomatis menyesuaikan batas peta ke kendaraan
function MapAutoBounds({
  vehicles,
  selectedRouteIds,
}: {
  vehicles: any[];
  selectedRouteIds: string[];
}) {
  const map = useMap();
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.attributes.latitude, v.attributes.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (selectedRouteIds.length > 0) {
      map.setView(defaultCenter, 12, { animate: true });
    }
  }, [selectedRouteIds, map]);

  return null;
}

// Komponen RecenterButton - memungkinkan pengguna untuk memusatkan ulang peta
function RecenterButton({ vehicles }: { vehicles: any[] }) {
  const map = useMap();
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  const handleRecenter = () => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.attributes.latitude, v.attributes.longitude]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(defaultCenter, 12, { animate: true });
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right mb-6 mr-6">
      <div className="leaflet-control">
        <button
          onClick={handleRecenter}
          className="bg-white hover:bg-gray-50 text-[#003366] p-3 rounded-full shadow-2xl border border-gray-200 flex items-center justify-center transition-all active:scale-90 group"
          title="Pusatkan Ulang Peta"
        >
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
  selectedRouteIds,
}: FleetMapProps) {
  const defaultCenter: [number, number] = [42.3601, -71.0589];

  return (
    <div className="w-full h-[calc(100vh-300px)] rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoBounds
          vehicles={vehicles}
          selectedRouteIds={selectedRouteIds}
        />
        <RecenterButton vehicles={vehicles} />

        {vehicles.map((v) => {
          // Ekstrak data kendaraan dan informasi terkait
          const { attributes, relationships } = v;
          const routeId = relationships.route.data?.id;
          const routeInfo = included.find(
            (i) => i.type === "route" && i.id === routeId,
          );

          const tripId = relationships.trip.data?.id;
          const tripInfo = included.find(
            (i) => i.type === "trip" && i.id === tripId,
          );

          const stopId = relationships.stop.data?.id;
          const stopInfo = included.find(
            (i) => i.type === "stop" && i.id === stopId,
          );
          const stopName =
            stopInfo?.attributes.name || "Lokasi Tidak Diketahui";

          const color = routeInfo?.attributes.color
            ? `#${routeInfo.attributes.color}`
            : "#003366";
          const position: [number, number] = [
            attributes.latitude,
            attributes.longitude,
          ];

          const formatStatus = (status: string | null) => {
            if (!status) return "Tidak Diketahui";
            return (
              status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) + `: ${stopName}`
            );
          };

          return (
            <Marker
              key={v.id}
              position={position}
              icon={createColoredIcon(color)}
              eventHandlers={{
                click: (e) => {
                  // Saat penanda diklik, animasi peta ke posisi dengan offset kamera
                  const map = e.target._map;

                  const { lat, lng } = e.target.getLatLng();

                  const cameraOffset = 0.006;
                  const targetPosition: [number, number] = [
                    lat + cameraOffset,
                    lng,
                  ];

                  map.flyTo(targetPosition, 15, {
                    duration: 1.5,
                    easeLinearity: 0.25,
                  });
                },
              }}
            >
              <Popup minWidth={260} maxWidth={260}>
                <div className="p-1 font-sans w-full flex flex-col gap-3">
                  {/* Kepala */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Status & Lokasi
                    </p>
                    <p className="text-sm font-black text-gray-800 leading-tight line-clamp-2 italic">
                      {formatStatus(attributes.current_status)}
                    </p>
                  </div>

                  {/* Grid Koordinat */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="border-r border-gray-200">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Lintang
                      </p>
                      <p className="text-xs font-mono font-bold text-blue-600">
                        {attributes.latitude.toFixed(5)}
                      </p>
                    </div>
                    <div className="pl-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Bujur
                      </p>
                      <p className="text-xs font-mono font-bold text-blue-600">
                        {attributes.longitude.toFixed(5)}
                      </p>
                    </div>
                  </div>

                  {/* Rute/Trip */}
                  <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                    <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">
                      Rute & Tujuan
                    </p>
                    <p className="text-xs font-bold text-[#003366] truncate">
                      {routeInfo?.attributes.long_name}
                    </p>
                    <p className="text-[10px] text-blue-700 font-medium truncate">
                      Tujuan Berikutnya: {tripInfo?.attributes.headsign}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-gray-400">
                    <span>
                      Pembaruan:{" "}
                      {new Date(attributes.updated_at).toLocaleTimeString()}
                    </span>
                    <span className="font-bold">ID: {v.id}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
