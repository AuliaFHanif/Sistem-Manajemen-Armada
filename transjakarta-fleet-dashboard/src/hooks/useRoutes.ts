import { useState, useEffect } from "react";
import { mbtaService } from "../services/api";
import type { MBTARoute } from "../types/mbta";

export const useRoutes = () => {
  const [routes, setRoutes] = useState<MBTARoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRoutes = async () => {
      try {
        setLoading(true);
        const response = await mbtaService.fetchRoutes();

        setRoutes(response.data);
      } catch (err) {
        setError("Gagal mengambil data rute");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getRoutes();
  }, []);

  return { routes, loading, error };
};
