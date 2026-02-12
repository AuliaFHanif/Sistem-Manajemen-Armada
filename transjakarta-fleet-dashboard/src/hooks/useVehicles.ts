import { useState, useEffect, useCallback } from "react";
import { mbtaService } from "../services/api";
import type { MBTAVehicle, MBTAIncluded } from "../types/mbta";

export const useVehicles = (
  limit = 10,
  routeIds: string[] = [],
  tripIds: string[] = [],
  applyTripFilter = true,
) => {
  const [vehicles, setVehicles] = useState<MBTAVehicle[]>([]);
  const [included, setIncluded] = useState<MBTAIncluded[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadData = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);

        let response;

        // Tangani filter khusus "tidak ada trip"
        if (applyTripFilter && tripIds.includes("NO_TRIP")) {
          response = await mbtaService.fetchVehiclesByRoute(routeIds);
          response = {
            ...response,
            data: response.data.filter((v) => !v.relationships.trip.data?.id),
          };
        } else if (applyTripFilter && tripIds.includes("NONREV")) {
          // Tangani filter trip non-revenue
          response = await mbtaService.fetchVehiclesByRoute(routeIds);
          response = {
            ...response,
            data: response.data.filter((v) => {
              const tripId = v.relationships.trip.data?.id;
              return tripId && tripId.startsWith("NONREV");
            }),
          };
        } else if (applyTripFilter && tripIds.length > 0) {
          response = await mbtaService.fetchVehiclesByTrip(tripIds);
        } else if (routeIds.length > 0) {
          response = await mbtaService.fetchVehiclesByRoute(routeIds);
        } else {
          response = await mbtaService.fetchVehicles(limit);
        }

        setVehicles(response.data);
        setIncluded(response.included || []);
        setLastSynced(new Date());
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal memperbarui data kendaraan";
        setError(message);
        console.error(err);
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [limit, JSON.stringify(routeIds), JSON.stringify(tripIds), applyTripFilter],
  );

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData(false);
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

  return { vehicles, included, loading, error, lastSynced };
};
