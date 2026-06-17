import type {
  AgentOptionsPayload,
  AppConfig,
  MemoryFiles,
  RequestItem,
} from "@web/types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

async function post<T>(path: string, data?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

async function patch<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

export const api = {
  config: () => get<AppConfig>("/config"),
  updateConfigSettings: (agent: AppConfig["agent"]) =>
    patch<AppConfig>("/config/settings", { agent }),
  memory: () => get<MemoryFiles>("/memory"),
  requests: () => get<RequestItem[]>("/requests"),
  queueRequest: (type: string, payload: Record<string, unknown> = {}) =>
    post<RequestItem>("/requests", { type, payload }),
  removeRequest: (id: string) => del<RequestItem>(`/requests/${id}`),
  agentOptions: () => get<AgentOptionsPayload>("/agent/options"),
};
