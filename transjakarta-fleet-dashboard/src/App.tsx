import { useState, useMemo } from "react";
import { useVehicles } from "./hooks/useVehicles";
import { useRoutes } from "./hooks/useRoutes";
import VehicleCard from "./components/VehicleCard";
import FleetMap from "./components/FleetMap";

export default function App() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [isMapView, setIsMapView] = useState(false);

  const {
    vehicles,
    included,
    loading: vehiclesLoading,
    error: vehiclesError,
  } = useVehicles(30);
  const { routes, loading: routesLoading } = useRoutes();

  const filteredVehicles = useMemo(() => {
    if (!selectedRouteId) return vehicles;
    return vehicles.filter(
      (v) => v.relationships.route.data?.id === selectedRouteId,
    );
  }, [vehicles, selectedRouteId]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* HEADER */}
      <header className="bg-[#003366] text-white sticky top-0 z-50 shadow-lg">
        <div className="w-full px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#003366] font-bold text-xl">T</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              MBTA Fleet Monitor
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label
              htmlFor="route-select"
              className="hidden sm:inline text-sm font-medium text-blue-100"
            >
              Filter Service:
            </label>
            <select
              id="route-select"
              className="bg-white text-gray-900 text-sm rounded-lg block w-full md:w-64 p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              disabled={routesLoading}
            >
              <option value="">All Services</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.attributes.long_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* DASHBOARD */}
      <main className="w-full px-8 py-10 grow">
        <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold text-[#003366]">
                Vehicle Status
              </h2>

              {/* NEW: Counter Text */}
              <span className="text-lg font-medium text-gray-400">
                {filteredVehicles.length === 0
                  ? "— There are no vehicles on this line"
                  : `— There are ${filteredVehicles.length} vehicle${filteredVehicles.length === 1 ? "" : "s"} on this line`}
              </span>
            </div>

            <p className="text-gray-500 mt-1">
              Real-time tracking of active fleet units.
            </p>
          </div>

          {/* TOGGLE BUTTON  */}
          <button
            onClick={() => setIsMapView(!isMapView)}
            className="flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-xl font-bold transition-all hover:bg-blue-900 shadow-lg active:scale-95"
          >
            {isMapView ? "Show List View" : "Show Map View"}
          </button>
        </div>

        {vehiclesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
          </div>
        ) : vehiclesError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {vehiclesError}
          </div>
        ) : (
          /* Toggle between Map and List */
          <>
            {isMapView ? (
              <div className="w-full">
                <FleetMap
                  vehicles={filteredVehicles}
                  included={included}
                  selectedRouteId={selectedRouteId}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      included={included}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">
                      No active vehicles found for this service.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-[#003366] text-white/70 py-8 mt-auto">
        <div className="w-full px-8 text-center text-sm">
          <p>© 2026 Fleet Dashboard — Transjakarta</p>
        </div>
      </footer>
    </div>
  );
}
