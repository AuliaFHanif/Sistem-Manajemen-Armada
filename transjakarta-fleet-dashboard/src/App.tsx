import { useState, useMemo, useRef, useEffect } from "react";
import { useVehicles } from "./hooks/useVehicles";
import { useRoutes } from "./hooks/useRoutes";
import { useTrips } from "./hooks/useTrips";
import VehicleCard from "./components/VehicleCard";
import FleetMap from "./components/FleetMap";

export default function App() {
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [isMapView, setIsMapView] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(true);

  // Dropdown refs
  const routeDropdownRef = useRef<HTMLDivElement>(null);
  const routeLoadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const tripDropdownRef = useRef<HTMLDivElement>(null);
  const tripLoadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    vehicles,
    included,
    loading: vehiclesLoading,
    error: vehiclesError,
  } = useVehicles(1000, selectedRouteIds, selectedTripIds);
  const {
    routes,
    loading: routesLoading,
    error: routesError,
    hasMore: hasMoreRoutes,
    loadMoreRoutes,
  } = useRoutes();
  const tripRouteIds = useMemo(
    () => (selectedRouteIds.length > 0 ? selectedRouteIds : []),
    [selectedRouteIds],
  );
  const {
    trips,
    loading: tripsLoading,
    error: tripsError,
    hasMore: hasMoreTrips,
    loadMoreTrips,
  } = useTrips(tripRouteIds);

  const tripGroups = useMemo(() => {
    const groups = new Map<string, typeof trips>();
    trips.forEach((trip) => {
      const blockId = trip.attributes.block_id || "Tidak Ditugaskan";
      if (!groups.has(blockId)) {
        groups.set(blockId, []);
      }
      groups.get(blockId)?.push(trip);
    });

    return Array.from(groups.entries()).map(([blockId, groupedTrips]) => ({
      blockId,
      trips: groupedTrips,
    }));
  }, [trips]);

  // Lazy load routes
  useEffect(() => {
    const trigger = routeLoadMoreTriggerRef.current;
    const dropdown = routeDropdownRef.current;
    if (!trigger || !dropdown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRoutes) {
          loadMoreRoutes();
        }
      },
      { root: dropdown, rootMargin: "0px 0px 50px 0px", threshold: 0 },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMoreRoutes, loadMoreRoutes]);

  // Lazy load trips
  useEffect(() => {
    const trigger = tripLoadMoreTriggerRef.current;
    const dropdown = tripDropdownRef.current;
    if (!trigger || !dropdown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreTrips) {
          loadMoreTrips();
        }
      },
      { root: dropdown, rootMargin: "0px 0px 50px 0px", threshold: 0 },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMoreTrips, loadMoreTrips]);

  // Logika Filter
  const filteredVehicles = useMemo(() => {
    if (selectedRouteIds.length === 0) return vehicles;

    return vehicles.filter((v) =>
      selectedRouteIds.includes(v.relationships.route.data?.id || ""),
    );
  }, [vehicles, selectedRouteIds]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRouteIds]);

  const toggleRoute = (id: string) => {
    setSelectedRouteIds((prev) =>
      prev.includes(id)
        ? prev.filter((routeId) => routeId !== id)
        : [...prev, id],
    );
  };

  const toggleTrip = (id: string) => {
    setSelectedTripIds((prev) =>
      prev.includes(id)
        ? prev.filter((tripId) => tripId !== id)
        : [...prev, id],
    );
  };

  // Logika Paginasi
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* KEPALA */}
      <header className="bg-[#003366] text-white sticky top-0 z-1001 shadow-lg">
        <div className="w-full px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#003366] font-bold text-xl">T</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              Pemantau Armada MBTA
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="hidden sm:inline text-sm font-medium text-blue-100">
              Filter Berdasarkan Layanan:
            </label>

            {/* Kontainer Dropdown */}
            <div className="relative group w-full md:w-72">
              <button
                className="bg-white text-gray-900 text-sm rounded-lg flex items-center justify-between w-full p-2.5 outline-none shadow-inner"
                disabled={routesLoading}
              >
                <span className="truncate">
                  {selectedRouteIds.length === 0
                    ? "Semua Layanan"
                    : `${selectedRouteIds.length} Rute Dipilih`}
                </span>
                <svg
                  className="w-4 h-4 ml-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Konten Dropdown */}
              <div
                ref={routeDropdownRef}
                className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-9999 max-h-80 overflow-y-auto"
                style={{ overscrollBehavior: "contain" }}
              >
                <div className="p-2 space-y-1">
                  {selectedRouteIds.length > 0 && (
                    <button
                      onClick={() => setSelectedRouteIds([])}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border-b mb-1"
                    >
                      Hapus Pilihan
                    </button>
                  )}

                  {routes.map((route) => (
                    <label
                      key={route.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group/item"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#003366] rounded border-gray-300 focus:ring-[#003366]"
                        checked={selectedRouteIds.includes(route.id)}
                        onChange={() => toggleRoute(route.id)}
                      />
                      <span
                        className={`text-sm ${selectedRouteIds.includes(route.id) ? "font-bold text-[#003366]" : "text-gray-700"}`}
                      >
                        {route.attributes.long_name}
                      </span>
                    </label>
                  ))}

                  {hasMoreRoutes && (
                    <div
                      ref={routeLoadMoreTriggerRef}
                      className="p-3 text-center"
                    >
                      <span className="text-xs text-gray-400 font-bold animate-pulse uppercase tracking-widest">
                        Memuat Lagi...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Filter dan Dropdown */}
            <label className="hidden sm:inline text-sm font-medium text-blue-100">
              Filter Berdasarkan Trip:
            </label>
            <div className="relative group w-full md:w-72">
              <button
                className="bg-white text-gray-900 text-sm rounded-lg flex items-center justify-between w-full p-2.5 outline-none shadow-inner"
                disabled={tripsLoading || selectedRouteIds.length === 0}
              >
                <span className="truncate">
                  {selectedTripIds.length === 0
                    ? "Semua Trip"
                    : `${selectedTripIds.length} Trip Dipilih`}
                </span>
                <svg
                  className="w-4 h-4 ml-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Konten Dropdown */}
              <div
                ref={tripDropdownRef}
                className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-9999 max-h-80 overflow-y-auto"
                style={{ overscrollBehavior: "contain" }}
              >
                <div className="p-2 space-y-1">
                  {selectedRouteIds.length === 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400">
                      Pilih rute untuk memuat trip.
                    </div>
                  )}
                  {selectedTripIds.length > 0 && (
                    <button
                      onClick={() => setSelectedTripIds([])}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border-b mb-1"
                    >
                      Hapus Pilihan
                    </button>
                  )}

                  {tripGroups.map((group) => (
                    <div key={group.blockId} className="mb-2">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Blok {group.blockId}
                      </div>
                      {group.trips.map((trip) => (
                        <label
                          key={trip.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group/item"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#003366] rounded border-gray-300 focus:ring-[#003366]"
                            checked={selectedTripIds.includes(trip.id)}
                            onChange={() => toggleTrip(trip.id)}
                          />
                          <span
                            className={`text-sm ${selectedTripIds.includes(trip.id) ? "font-bold text-[#003366]" : "text-gray-700"}`}
                          >
                            {trip.attributes.headsign || trip.attributes.name}
                            <span className="text-[10px] text-gray-400 block">
                              {trip.attributes.name || "Tanpa nama pendek"} • ID{" "}
                              {trip.id}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}

                  {hasMoreTrips && (
                    <div
                      ref={tripLoadMoreTriggerRef}
                      className="p-3 text-center"
                    >
                      <span className="text-xs text-gray-400 font-bold animate-pulse uppercase tracking-widest">
                        Memuat Lagi...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DASBOR */}
      <main className="w-full px-8 py-10 grow">
        {showErrorBanner && (vehiclesError || routesError || tripsError) && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold mb-2">Error API</div>
              {vehiclesError && <div>Kendaraan: {vehiclesError}</div>}
              {routesError && <div>Rute: {routesError}</div>}
              {tripsError && <div>Trip: {tripsError}</div>}
            </div>
            <button
              type="button"
              onClick={() => setShowErrorBanner(false)}
              className="text-xs font-semibold text-red-700 hover:text-red-900"
              aria-label="Tutup banner kesalahan API"
            >
              Tutup
            </button>
          </div>
        )}
        <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold text-[#003366]">
                Status Kendaraan
              </h2>
              <span className="text-lg font-medium text-gray-400">
                {totalItems === 0
                  ? "— Tidak ada kendaraan pada rute ini"
                  : `— ${totalItems} kendaraan ditemukan`}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Pelacakan waktu nyata unit armada aktif.
            </p>
          </div>

          <button
            onClick={() => setIsMapView(!isMapView)}
            className="flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-xl font-bold transition-all hover:bg-blue-900 shadow-lg active:scale-95"
          >
            {isMapView
              ? "Tampilkan Tampilan Daftar"
              : "Tampilkan Tampilan Peta"}
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
          <>
            {isMapView ? (
              <div className="w-full">
                <FleetMap
                  vehicles={filteredVehicles}
                  included={included}
                  selectedRouteIds={selectedRouteIds}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4">
                  {currentVehicles.length > 0 ? (
                    currentVehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        included={included}
                      />
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium">
                        Tidak ada kendaraan aktif ditemukan.
                      </p>
                    </div>
                  )}
                </div>

                {/* KONTROL PAGINASI */}
                {totalItems > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Menampilkan{" "}
                        <span className="font-bold text-gray-900">
                          {startIndex + 1}-{endIndex}
                        </span>{" "}
                        dari {totalItems}
                      </span>
                      <select
                        className="bg-white border border-gray-300 text-sm rounded-lg p-1 px-2"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        {[5, 10, 20, 50].map((size) => (
                          <option key={size} value={size}>
                            Tampilkan {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sebelumnya
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-[#003366] text-white/70 py-8 mt-auto">
        <div className="w-full px-8 text-center text-sm">
          <p>© 2026 Dashboard Armada — MBTA</p>
        </div>
      </footer>
    </div>
  );
}
