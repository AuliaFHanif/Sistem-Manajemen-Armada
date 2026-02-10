import type { MBTADataResponse, MBTARouteResponse } from '../types/mbta';

const BASE_URL = import.meta.env.VITE_MBTA_API_URL;

export const mbtaService = {
  // Mengambil data kendaraan dengan paginasi
  fetchVehicles: async (limit: number = 10, offset: number = 0): Promise<MBTADataResponse> => {
    const url = `${BASE_URL}/vehicles?page[limit]=${limit}&page[offset]=${offset}&include=route,trip`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },

// Mengambil data rute untuk filter dengan infinite scroll logic 
  fetchRoutes: async (limit: number = 10, offset: number = 0): Promise<MBTARouteResponse> => {
    const url = `${BASE_URL}/routes?page[limit]=${limit}&page[offset]=${offset}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching routes:", error);
      throw error; 
    }
  },
};