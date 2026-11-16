import { useEffect, useState } from "react";
import { getApiData } from "../services/api";

interface ApiResourceState<T> {
  path: string;
  data: T;
  error: string | null;
  isLoading: boolean;
}

interface ApiResource<T> {
  data: T;
  error: string | null;
  isLoading: boolean;
}

export function useApiResource<T>(
  path: string,
  initialData: T,
): ApiResource<T> {
  const [stableInitialData] = useState(initialData);
  const [resource, setResource] = useState<ApiResourceState<T>>(() => ({
    path,
    data: stableInitialData,
    error: null,
    isLoading: true,
  }));

  useEffect(() => {
    const controller = new AbortController();

    getApiData<T>(path, controller.signal)
      .then((responseData) => {
        if (!controller.signal.aborted) {
          setResource({
            path,
            data: responseData,
            error: null,
            isLoading: false,
          });
        }
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResource({
          path,
          data: stableInitialData,
          error:
            requestError instanceof Error
              ? requestError.message
              : "Unable to load data.",
          isLoading: false,
        });
      });

    return () => controller.abort();
  }, [path, stableInitialData]);

  if (resource.path !== path) {
    return { data: stableInitialData, error: null, isLoading: true };
  }

  return resource;
}
