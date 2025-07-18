import useSWRMutation from "swr/mutation";
import type { IApiResponse, UnparkVehicleData } from "@/types";

export const useUnparkVehicle = () => {
  const mutator = async (
    url: string,
    { arg }: { arg: { plate_number: string } }
  ) => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  };

  const { trigger, isMutating, error } = useSWRMutation<
    IApiResponse<UnparkVehicleData>,
    Error,
    string,
    { plate_number: string }
  >(`${import.meta.env.VITE_API_BASE_URL}/parking-management/unpark`, mutator);

  const unparkVehicle = async (plateNumber: string) => {
    return trigger({ plate_number: plateNumber });
  };

  return {
    unparkVehicle,
    isLoading: isMutating,
    error,
  };
};
