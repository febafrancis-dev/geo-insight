const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000/api"
).replace(/\/+$/, "");

async function requestApiData<T>(
  path: string,
  init: RequestInit,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, signal });
  const body: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error !== null &&
      "message" in body.error &&
      typeof body.error.message === "string"
        ? body.error.message
        : `Request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return body as T;
}

export function getApiData<T>(path: string, signal: AbortSignal): Promise<T> {
  return requestApiData<T>(path, {}, signal);
}

export function postApiData<TResponse, TRequest>(
  path: string,
  body: TRequest,
  signal: AbortSignal,
): Promise<TResponse> {
  return requestApiData<TResponse>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    signal,
  );
}
