import type {
  MBTADataResponse,
  MBTARouteResponse,
  MBTATripResponse,
} from "../types/mbta";

const BASE_URL = import.meta.env.VITE_MBTA_API_URL;

const getApiErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    const apiError = data?.errors?.[0];
    if (apiError) {
      const status = apiError.status || response.status;
      const detail = apiError.detail || apiError.title || "Request failed";
      const param = apiError.source?.parameter;
      return `${status}: ${detail}${param ? ` (parameter: ${param})` : ""}`;
    }
  } catch {}
  return `HTTP ${response.status}`;
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }
  return response.json();
};

export const mbtaService = {
  // Mengambil data kendaraan dengan paginasi
  fetchVehicles: async (
    limit: number = 10,
    offset: number = 0,
  ): Promise<MBTADataResponse> => {
    const url = `${BASE_URL}/vehicles?page[limit]=${limit}&page[offset]=${offset}&include=route,trip,stop`;

    try {
      return await fetchJson<MBTADataResponse>(url);
    } catch (error) {
      console.error("Gagal mengambil data kendaraan:", error);
      throw error;
    }
  },

  // Ambil kendaraan yang difilter berdasarkan rute spesifik
  fetchVehiclesByRoute: async (
    routeIds: string[],
  ): Promise<MBTADataResponse> => {
    if (routeIds.length === 0) {
      return mbtaService.fetchVehicles(500);
    }

    // Gabungkan ID rute untuk filter
    const routeFilter = routeIds.join(",");
    const url = `${BASE_URL}/vehicles?filter[route]=${routeFilter}&page[limit]=500&include=route,trip,stop`;

    try {
      return await fetchJson<MBTADataResponse>(url);
    } catch (error) {
      console.error("Gagal mengambil data kendaraan untuk rute:", error);
      throw error;
    }
  },

  // Mengambil data rute untuk filter dengan infinite scroll logic
  fetchRoutes: async (
    limit: number = 10,
    offset: number = 0,
  ): Promise<MBTARouteResponse> => {
    const url = `${BASE_URL}/routes?page[limit]=${limit}&page[offset]=${offset}`;
    try {
      return await fetchJson<MBTARouteResponse>(url);
    } catch (error) {
      console.error("Gagal mengambil data rute:", error);
      throw error;
    }
  },

  // Ambil trip yang difilter berdasarkan rute
  fetchTrips: async (
    routeIds: string[],
    limit: number = 10,
    offset: number = 0,
  ): Promise<MBTATripResponse> => {
    // API MBTA memerlukan filter[route] untuk mengambil trip
    if (routeIds.length === 0) {
      // Tidak bisa mengambil trip tanpa rute
      return { data: [], links: { first: "", last: "" } };
    }

    const routeFilter = routeIds.join(",");
    const url = `${BASE_URL}/trips?filter[route]=${routeFilter}&page[limit]=${limit}&page[offset]=${offset}`;
    try {
      return await fetchJson<MBTATripResponse>(url);
    } catch (error) {
      console.error("Gagal mengambil data trip:", error);
      throw error;
    }
  },

  // Ambil kendaraan yang difilter berdasarkan trip spesifik
  fetchVehiclesByTrip: async (tripIds: string[]): Promise<MBTADataResponse> => {
    if (tripIds.length === 0) {
      return mbtaService.fetchVehicles(500);
    }

    // Gabungkan ID trip untuk filter
    const tripFilter = tripIds.join(",");
    const url = `${BASE_URL}/vehicles?filter[trip]=${tripFilter}&page[limit]=500&include=route,trip,stop`;

    try {
      return await fetchJson<MBTADataResponse>(url);
    } catch (error) {
      console.error("Gagal mengambil data kendaraan untuk trip:", error);
      throw error;
    }
  },

  // Ambil kendaraan yang difilter berdasarkan headsign dan direction_id
  fetchVehiclesByHeadsign: async (
    routeIds: string[],
    headsign: string,
    directionId: number,
  ): Promise<MBTADataResponse> => {
    if (routeIds.length === 0) {
      return mbtaService.fetchVehicles(500);
    }

    const routeFilter = routeIds.join(",");
    const url = `${BASE_URL}/vehicles?filter[route]=${routeFilter}&filter[direction_id]=${directionId}&page[limit]=500&include=route,trip,stop`;

    try {
      const response = await fetchJson<MBTADataResponse>(url);

      // Filter by headsign on the client side (API doesn't support headsign filter)
      const filtered = {
        ...response,
        data: response.data.filter((vehicle) => {
          const tripInfo = response.included?.find(
            (i) =>
              i.type === "trip" && i.id === vehicle.relationships.trip.data?.id,
          );
          return (tripInfo as any)?.attributes.headsign === headsign;
        }),
      };

      return filtered;
    } catch (error) {
      console.error("Failed to fetch vehicles by headsign:", error);
      throw error;
    }
  },
};
