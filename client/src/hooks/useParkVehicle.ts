import useSWRMutation from "swr/mutation";
import type { IApiResponse, ParkVehicleData, ParkVehicleForm } from "@/types";

export const useParkVehicle = () => {
  const mutator = async (url: string, { arg }: { arg: ParkVehicleForm }) => {
    const response = await fetch(url, {
      method: "POST",
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
    IApiResponse<ParkVehicleData>,
    Error,
    string,
    ParkVehicleForm
  >(`${import.meta.env.VITE_API_BASE_URL}/parking-management/park`, mutator);

  const parkVehicle = async (formData: ParkVehicleForm) => {
    return trigger(formData);
  };

  return {
    parkVehicle,
    isLoading: isMutating,
    error,
  };
};
