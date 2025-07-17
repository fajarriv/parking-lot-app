import useSWR from "swr";
import type { ParkingMapData } from "@/types";

export const useParkingMap = () => {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  };

  const { data, error, isLoading, mutate } = useSWR<ParkingMapData, Error>(
    `${import.meta.env.VITE_API_BASE_URL}/parking-map`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
