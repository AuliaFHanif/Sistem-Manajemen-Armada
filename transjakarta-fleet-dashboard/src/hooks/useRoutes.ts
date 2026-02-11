import { useState, useEffect, useCallback } from "react";
import { mbtaService } from "../services/api";
import type { MBTARoute } from "../types/mbta";

export const useRoutes = () => {
  const [routes, setRoutes] = useState<MBTARoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const itemsPerPage = 10;

  const loadMoreRoutes = useCallback(async () => {
    try {
      const response = await mbtaService.fetchRoutes(itemsPerPage, offset);
      const newRoutes = response.data || [];

      setRoutes((prev) => [...prev, ...newRoutes]);

      // Periksa apakah ada lebih banyak rute yang akan diambil
      if (newRoutes.length < itemsPerPage) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + itemsPerPage);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data rute";
      setError(message);
      console.error(err);
      setHasMore(false);
    }
  }, [offset]);

  useEffect(() => {
    const getInitialRoutes = async () => {
      try {
        setLoading(true);
        const response = await mbtaService.fetchRoutes(itemsPerPage, 0);
        const initialRoutes = response.data || [];

        setRoutes(initialRoutes);
        setError(null);

        // Periksa apakah ada lebih banyak rute yang akan diambil
        if (initialRoutes.length < itemsPerPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setOffset(itemsPerPage);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengambil data rute";
        setError(message);
        console.error(err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialRoutes();
  }, []);

  return { routes, loading, error, hasMore, loadMoreRoutes };
};
