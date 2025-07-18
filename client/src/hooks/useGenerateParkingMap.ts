import useSWRMutation from "swr/mutation";
import type {
  IApiResponse,
  ParkingMapData,
  GenerateParkingMapForm,
} from "@/types";

const mutator = async (
  url: string,
  { arg }: { arg: GenerateParkingMapForm }
) => {
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

export const useGenerateParkingMap = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    IApiResponse<ParkingMapData>,
    Error,
    string,
    GenerateParkingMapForm
  >(`${import.meta.env.VITE_API_BASE_URL}/parking-map`, mutator);

  const createMap = async (formData: GenerateParkingMapForm) => {
    return trigger(formData);
  };

  return {
    createMap,
    isLoading: isMutating,
    error,
  };
};
