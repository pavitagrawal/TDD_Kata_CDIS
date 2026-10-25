import type {
  AuthenticatedUser,
  Credentials,
  InventoryResponse,
  RegisterInput,
  RestockInput,
  Vehicle,
  VehicleInput,
  VehicleQuery,
} from "../types/domain";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/$/, "")
  : import.meta.env.DEV
    ? "http://localhost:8000"
    : "";

export const apiConfigurationMessage = apiBaseUrl
  ? null
  : "This deployment is missing VITE_API_BASE_URL. Set it to the public HTTPS backend URL in Vercel, then redeploy.";
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(payload: unknown, status: number): string {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("detail" in payload)
  ) {
    return `Request failed with status ${status}`;
  }
  const detail = payload.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item !== "object" || item === null || !("msg" in item)) {
          return null;
        }
        const message = (item as { msg: unknown }).msg;
        return typeof message === "string" ? message : null;
      })
      .filter((message): message is string => message !== null);
    if (messages.length > 0) return messages.join(" ");
  }
  return `Request failed with status ${status}`;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  if (apiConfigurationMessage) {
    throw new ApiError(apiConfigurationMessage, 503);
  }
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new ApiError(errorMessage(payload, response.status), response.status);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function vehiclePath(query: VehicleQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (value !== undefined && value !== "") params.set(key, String(value));
  const suffix = params.toString();
  return `/api/vehicles${suffix ? `/search?${suffix}` : ""}`;
}

export const api = {
  register: (input: RegisterInput) =>
    request<AuthenticatedUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: Credentials) =>
    request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: (token: string) => request<AuthenticatedUser>("/api/auth/me", {}, token),
  vehicles: (query: VehicleQuery, token?: string) =>
    request<Vehicle[]>(vehiclePath(query), {}, token),
  createVehicle: (input: VehicleInput, token: string) =>
    request<Vehicle>(
      "/api/vehicles",
      { method: "POST", body: JSON.stringify(input) },
      token,
    ),
  updateVehicle: (id: string, input: Partial<VehicleInput>, token: string) =>
    request<Vehicle>(
      `/api/vehicles/${id}`,
      { method: "PUT", body: JSON.stringify(input) },
      token,
    ),
  deleteVehicle: (id: string, token: string) =>
    request<void>(`/api/vehicles/${id}`, { method: "DELETE" }, token),
  purchase: (id: string, token: string) =>
    request<InventoryResponse>(
      `/api/vehicles/${id}/purchase`,
      { method: "POST" },
      token,
    ),
  restock: (id: string, input: RestockInput, token: string) =>
    request<InventoryResponse>(
      `/api/vehicles/${id}/restock`,
      { method: "POST", body: JSON.stringify(input) },
      token,
    ),
};
