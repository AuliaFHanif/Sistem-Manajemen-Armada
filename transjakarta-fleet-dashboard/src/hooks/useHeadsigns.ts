import { useState, useEffect } from "react";
import { mbtaService } from "../services/api";
import type { MBTATrip } from "../types/mbta";

export interface TripPattern {
  headsign: string;
  direction_id: number;
  route_id: string;
  displayName: string;
  tripIds: string[];
  activeCount?: number;
  isNoTrip?: boolean;
}

export const useHeadsigns = (routeIds: string[] = []) => {
  const [patterns, setPatterns] = useState<TripPattern[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (routeIds.length === 0) {
      setPatterns([]);
      setLoading(false);
      return;
    }

    const getHeadsigns = async () => {
      try {
        setLoading(true);

        // Fetch ALL trips by paginating until we get them all
        let allTrips: MBTATrip[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const response = await mbtaService.fetchTrips(
            routeIds,
            limit,
            offset,
          );

          if (response.data.length === 0) {
            hasMore = false;
          } else {
            allTrips = [...allTrips, ...response.data];
            offset += limit;

            // Stop if we got fewer results than requested (last page)
            if (response.data.length < limit) {
              hasMore = false;
            }

            // Safety limit: stop after 1000 trips to avoid infinite loops
            if (allTrips.length >= 1000) {
              hasMore = false;
            }
          }
        }

        // Group trips by headsign + direction
        const patternMap = new Map<string, TripPattern>();

        allTrips.forEach((trip: MBTATrip) => {
          const key = `${trip.attributes.headsign}-${trip.attributes.direction_id}`;

          if (!patternMap.has(key)) {
            const directionLabel =
              trip.attributes.direction_id === 0 ? "Outbound" : "Inbound";

            patternMap.set(key, {
              headsign: trip.attributes.headsign,
              direction_id: trip.attributes.direction_id,
              route_id: trip.attributes.route_id || routeIds[0],
              displayName: `${directionLabel}: ${trip.attributes.headsign}`,
              tripIds: [],
            });
          }

          // Add this trip ID to the pattern
          patternMap.get(key)!.tripIds.push(trip.id);
        });

        setPatterns(Array.from(patternMap.values()));
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengambil data headsign";
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getHeadsigns();
  }, [JSON.stringify(routeIds)]);

  return { patterns, loading, error };
};
