export type AgentSettings = { runnerId: string; modelId: string };

export type AppConfig = {
  agent?: AgentSettings;
};

export type RequestItem = {
  id: string;
  type: string;
  payload?: Record<string, unknown>;
  status: string;
  createdAt: string;
  completedAt: string | null;
  response: unknown;
};

export type AgentOptionsPayload = {
  settings: AgentSettings;
  runners: { id: string; label: string; description: string }[];
  modelCatalogs: Record<string, { id: string; label: string }[]>;
  defaults: AgentSettings;
};

export type MemoryFiles = {
  active: Record<string, string>;
  archive: { file: string; sizeBytes: number; updatedAt: string }[];
};

export type AgentStreamEvent =
  | { type: "status"; data: Record<string, unknown> }
  | { type: "log"; data: { line: string } }
  | { type: "error"; data: { message: string } }
  | { type: "done"; data: Record<string, unknown> };
