import useSWRMutation from "swr/mutation";
import type {
  IApiResponse,
  AddEntryPointForm,
  AddEntryPointResponse,
} from "@/types";

const mutator = async (url: string, { arg }: { arg: AddEntryPointForm }) => {
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

export const useAddEntryPoint = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    IApiResponse<AddEntryPointResponse>,
    Error,
    string,
    AddEntryPointForm
  >(`${import.meta.env.VITE_API_BASE_URL}/parking-map/entry-point`, mutator);

  const addEntryPoint = async (formData: AddEntryPointForm) => {
    return trigger(formData);
  };

  return {
    addEntryPoint,
    isLoading: isMutating,
    error,
  };
};
