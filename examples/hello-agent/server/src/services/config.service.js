import { normalizeAgentSettings } from "@loom/agent";
import { store } from "#server/store.js";

const CONFIG_FILE = "config.json";

export async function getConfig() {
  const raw = await store.readJson(CONFIG_FILE, {});
  return {
    ...raw,
    agent: normalizeAgentSettings(raw.agent ?? {}),
  };
}

export async function updateConfigSettings(patch) {
  const current = await getConfig();
  const next = { ...current, ...patch };
  if (patch.agent) {
    next.agent = normalizeAgentSettings({ ...current.agent, ...patch.agent });
  }
  await store.writeJson(CONFIG_FILE, next);
  return next;
}
