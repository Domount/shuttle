import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "@domount/shuttle/server";
import { createRequestQueue, createAgentRunner, createRequestsRouter, createAgentRouter } from "@domount/shuttle/agent";
import { store } from "#server/store.js";
import { getConfig } from "#server/services/config.service.js";
import configRoutes from "#server/routes/config.routes.js";
import memoryRoutes from "#server/routes/memory.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

const requestTypes = ["research-task", "message"];
const queue = createRequestQueue({
  store,
  requestTypes,
  cycleTypes: ["research-task"],
});

const runner = createAgentRunner({
  getAgentConfig: getConfig,
  projectRoot,
  projectName: "examples/hello-agent",
});

const requestsRouter = createRequestsRouter({ queue, runner });
const agentRouter = createAgentRouter({ runner });

export function createProjectApp() {
  return createApp({
    routes: [
      { path: "/api/config", router: configRoutes },
      { path: "/api/memory", router: memoryRoutes },
      { path: "/api/requests", router: requestsRouter },
      { path: "/api/agent", router: agentRouter },
    ],
  });
}
