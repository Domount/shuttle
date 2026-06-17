/** @typedef {"subscription"|"api"} ModelBilling */

/** @type {import('./types.js').AgentRunnerDefinition[]} */
export const AGENT_RUNNERS = [
  {
    id: "manual",
    label: "Manual — copy prompt",
    description: "Shows a prompt for Cursor Agent. Nothing runs from the server.",
    canStream: false,
    requiresApiKey: false,
    usesCliLogin: false,
    modelCatalog: null,
  },
  {
    id: "cursor-cli",
    label: "Cursor CLI",
    description: "Runs `agent --print` locally. Uses `agent login` session unless CURSOR_API_KEY is set.",
    canStream: true,
    requiresApiKey: false,
    usesCliLogin: true,
    modelCatalog: "cursor",
  },
  {
    id: "cursor-sdk",
    label: "Cursor SDK",
    description: "Runs @cursor/sdk from the server. Typically needs CURSOR_API_KEY.",
    canStream: true,
    requiresApiKey: true,
    usesCliLogin: false,
    modelCatalog: "cursor",
  },
];

/** @type {import('./types.js').AgentModelDefinition[]} */
const CURSOR_MODELS = [
  {
    id: "auto",
    label: "Auto",
    provider: "cursor",
    billing: "subscription",
    default: true,
    description: "Cursor picks from your plan.",
    sdkModel: { id: "auto" },
  },
  {
    id: "composer-2.5",
    label: "Composer 2.5",
    provider: "cursor",
    billing: "subscription",
    description: "Composer pool on individual plans.",
    sdkModel: { id: "composer-2.5", params: [{ id: "fast", value: "false" }] },
  },
];

/** @type {Record<string, import('./types.js').AgentModelDefinition[]>} */
export const MODEL_CATALOGS = { cursor: CURSOR_MODELS };

export const AGENT_MODELS = Object.values(MODEL_CATALOGS).flat();
const RUNNER_IDS = new Set(AGENT_RUNNERS.map((r) => r.id));
const MODEL_IDS = new Set(AGENT_MODELS.map((m) => m.id));

export function defaultAgentModelId() {
  return AGENT_MODELS.find((m) => m.default)?.id ?? "auto";
}

export function defaultAgentRunnerId() {
  return "manual";
}

export function getRunnerDefinition(id) {
  return AGENT_RUNNERS.find((r) => r.id === id) ?? AGENT_RUNNERS[0];
}

export function getModelDefinition(id) {
  return AGENT_MODELS.find((m) => m.id === id) ?? AGENT_MODELS.find((m) => m.default);
}

export function runnerModelCatalogId(runnerId) {
  const catalog = getRunnerDefinition(runnerId).modelCatalog;
  return catalog && catalog in MODEL_CATALOGS ? catalog : null;
}

export function runnerSupportsModelSelection(runnerId) {
  return runnerModelCatalogId(runnerId) !== null;
}

export function modelsForRunner(runnerId) {
  const catalogId = runnerModelCatalogId(runnerId);
  return catalogId ? MODEL_CATALOGS[catalogId] : [];
}

export function defaultModelForCatalog(catalogId) {
  const models = MODEL_CATALOGS[catalogId] ?? [];
  return models.find((m) => m.default)?.id ?? models[0]?.id ?? defaultAgentModelId();
}

export function defaultModelForRunner(runnerId) {
  const catalogId = runnerModelCatalogId(runnerId);
  if (!catalogId) return defaultAgentModelId();
  return defaultModelForCatalog(catalogId);
}

export function normalizeAgentSettings(raw = {}) {
  const runnerId = RUNNER_IDS.has(raw.runnerId) ? raw.runnerId : defaultAgentRunnerId();
  const storedModelId = MODEL_IDS.has(raw.modelId) ? raw.modelId : defaultAgentModelId();
  const catalogId = runnerModelCatalogId(runnerId);

  if (!catalogId) return { runnerId, modelId: storedModelId };

  const catalogIds = new Set((MODEL_CATALOGS[catalogId] ?? []).map((m) => m.id));
  const modelId = catalogIds.has(storedModelId) ? storedModelId : defaultModelForCatalog(catalogId);
  return { runnerId, modelId };
}

export function sdkModelSelection(modelId) {
  const def = getModelDefinition(modelId);
  return def?.sdkModel ?? { id: defaultAgentModelId() };
}
