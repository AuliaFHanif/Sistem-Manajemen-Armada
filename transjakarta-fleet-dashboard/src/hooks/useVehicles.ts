import { useState, useEffect, useCallback } from "react";
import { mbtaService } from "../services/api";
import type { MBTAVehicle, MBTAIncluded } from "../types/mbta";

export const useVehicles = (limit = 10) => {
  const [vehicles, setVehicles] = useState<MBTAVehicle[]>([]);
  const [included, setIncluded] = useState<MBTAIncluded[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadData = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);

        const response = await mbtaService.fetchVehicles(limit);

        setVehicles(response.data);
        setIncluded(response.included || []);
        setLastSynced(new Date());
        setError(null);
      } catch (err) {
        setError("Gagal memperbarui data kendaraan");
        console.error(err);
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    [limit],
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
