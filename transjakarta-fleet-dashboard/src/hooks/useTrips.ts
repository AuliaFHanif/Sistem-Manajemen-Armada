import { useState, useEffect, useCallback } from "react";
import { mbtaService } from "../services/api";
import type { MBTATrip } from "../types/mbta";

export const useTrips = (routeIds: string[] = []) => {
  const [trips, setTrips] = useState<MBTATrip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const itemsPerPage = 10;

  const mergeUniqueTrips = (current: MBTATrip[], incoming: MBTATrip[]) => {
    if (incoming.length === 0) return current;
    const existingIds = new Set(current.map((trip) => trip.id));
    const uniqueIncoming = incoming.filter((trip) => !existingIds.has(trip.id));
    return uniqueIncoming.length > 0
      ? [...current, ...uniqueIncoming]
      : current;
  };

  const loadMoreTrips = useCallback(async () => {
    if (routeIds.length === 0) return;

    try {
      const response = await mbtaService.fetchTrips(
        routeIds,
        itemsPerPage,
        offset,
      );
      const newTrips = response.data || [];

      setTrips((prev) => mergeUniqueTrips(prev, newTrips));

      // Periksa apakah ada lebih banyak trip yang akan diambil
      if (newTrips.length < itemsPerPage) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + itemsPerPage);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data trip";
      setError(message);
      console.error(err);
      setHasMore(false);
    }
  }, [offset, routeIds]);

  useEffect(() => {
    // Reset state saat rute berubah
    setTrips([]);
    setOffset(0);
    setHasMore(true);
    setError(null);

    // Tidak bisa memuat trip tanpa rute
    if (routeIds.length === 0) {
      setLoading(false);
      return;
    }

    const getInitialTrips = async () => {
      try {
        setLoading(true);
        const response = await mbtaService.fetchTrips(
          routeIds,
          itemsPerPage,
          0,
        );
        const initialTrips = response.data || [];

        setTrips(mergeUniqueTrips([], initialTrips));
        setError(null);

        // Periksa apakah ada lebih banyak trip yang akan diambil
        if (initialTrips.length < itemsPerPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
          setOffset(itemsPerPage);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengambil data trip";
        setError(message);
        console.error(err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialTrips();
  }, [routeIds]);

  return { trips, loading, error, hasMore, loadMoreTrips };
};
