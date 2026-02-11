import { useState, useEffect, useCallback } from "react";
import { mbtaService } from "../services/api";
import type { MBTAVehicle, MBTAIncluded } from "../types/mbta";

export const useVehicles = (
  limit = 10,
  routeIds: string[] = [],
  tripIds: string[] = [],
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

        if (tripIds.length > 0) {
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
    [limit, routeIds, tripIds],
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
