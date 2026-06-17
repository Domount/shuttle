import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_CONFIG = {
  ports: { server: 4600, web: 4601 },
  requestTypes: {
    cycleTypes: [],
    all: ["message"],
  },
  verify: {
    scopedTests: {},
    corePaths: [
      "shared/",
      "server/src/providers/",
      "server/src/store.js",
    ],
  },
};

/**
 * @param {string} root
 * @returns {typeof DEFAULT_CONFIG & Record<string, unknown>}
 */
export function loadShuttleConfig(root) {
  const configPath = path.join(root, "shuttle.config.json");
  if (!existsSync(configPath)) return { ...DEFAULT_CONFIG };
  const raw = JSON.parse(readFileSync(configPath, "utf8"));
  return {
    ...DEFAULT_CONFIG,
    ...raw,
    verify: { ...DEFAULT_CONFIG.verify, ...raw.verify },
    requestTypes: { ...DEFAULT_CONFIG.requestTypes, ...raw.requestTypes },
    ports: { ...DEFAULT_CONFIG.ports, ...raw.ports },
  };
}

export { DEFAULT_CONFIG };
