import { randomUUID } from "node:crypto";
import { Router } from "express";
import * as manual from "./runners/manual.runner.js";
import * as cursorCli from "./runners/cursor-cli.runner.js";
import * as cursorSdk from "./runners/cursor-sdk.runner.js";
import {
  AGENT_RUNNERS,
  MODEL_CATALOGS,
  defaultAgentModelId,
  defaultAgentRunnerId,
  getModelDefinition,
  getRunnerDefinition,
  normalizeAgentSettings,
  runnerSupportsModelSelection,
} from "./registry.js";

const DEFAULT_RUNNERS = { manual, "cursor-cli": cursorCli, "cursor-sdk": cursorSdk };

/**
 * @param {{ store: import('../store/index.js').Store, requestTypes: string[], cycleTypes?: string[] }} options
 */
export function createRequestQueue({ store, requestTypes, cycleTypes = [] }) {
  const REQUEST_TYPES = new Set(requestTypes);
  const CYCLE_TYPES = new Set(cycleTypes);

  async function createRequest(type, payload = {}) {
    if (!REQUEST_TYPES.has(type)) {
      throw Object.assign(
        new Error(`type must be one of: ${[...REQUEST_TYPES].join(", ")}`),
        { status: 400 },
      );
    }

    if (CYCLE_TYPES.has(type)) {
      const existing = await store.listJson("requests");
      const duplicate = existing.find((r) => r.status === "pending" && r.type === type);
      if (duplicate) {
        throw Object.assign(
          new Error(`A pending ${type} request is already queued`),
          { status: 409, existingId: duplicate.id },
        );
      }
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const item = { id, type, payload, status: "pending", createdAt, completedAt: null, response: null };
    const fileName = `${createdAt.replace(/[:.]/g, "-")}-${type}-${id.slice(0, 8)}.json`;
    await store.writeJson(`requests/${fileName}`, item);
    return item;
  }

  async function deleteRequest(id) {
    if (!id || typeof id !== "string") throw new Error("id is required");
    const found = await store.findJsonFileByField("requests", "id", id);
    if (!found) throw new Error("request not found");
    if (found.data.status !== "pending") throw new Error("only pending requests can be removed");
    await store.deleteJson(`requests/${found.fileName}`);
    return found.data;
  }

  async function getRequest(id) {
    const found = await store.findJsonFileByField("requests", "id", id);
    if (!found) throw Object.assign(new Error("request not found"), { status: 404 });
    if (found.data.status !== "pending") {
      throw Object.assign(new Error("only pending requests can be executed"), { status: 400 });
    }
    return found.data;
  }

  async function listRequests() {
    const items = await store.listJson("requests");
    items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return items;
  }

  return { createRequest, deleteRequest, getRequest, listRequests, REQUEST_TYPES, CYCLE_TYPES };
}

/**
 * @param {{ store?: import('../store/index.js').Store, getAgentConfig?: () => Promise<{ agent?: { runnerId?: string, modelId?: string } }>, runners?: Record<string, { execute: Function, executeStream?: Function, getInfo?: Function }>, projectRoot?: string, projectName?: string }} options
 */
export function createAgentRunner(options = {}) {
  const runners = { ...DEFAULT_RUNNERS, ...options.runners };
  const ctx = { projectRoot: options.projectRoot ?? process.cwd(), projectName: options.projectName };

  async function resolveAgentSettings() {
    const config = options.getAgentConfig ? await options.getAgentConfig() : {};
    const fromEnv = process.env.AGENT_RUNNER;
    const base = normalizeAgentSettings(config.agent ?? {});
    if (fromEnv && fromEnv in runners) return { ...base, runnerId: fromEnv };
    return base;
  }

  function getRunnerById(runnerId) {
    return runners[runnerId in runners ? runnerId : defaultAgentRunnerId()];
  }

  async function getAgentOptions() {
    const settings = await resolveAgentSettings();
    const activeRunner = getRunnerDefinition(settings.runnerId);

    return {
      settings,
      runners: AGENT_RUNNERS.map((r) => {
        const impl = runners[r.id];
        const info = impl?.getInfo?.() ?? {};
        return { ...r, ...info };
      }),
      modelCatalogs: MODEL_CATALOGS,
      active: {
        runner: activeRunner,
        model: runnerSupportsModelSelection(settings.runnerId)
          ? getModelDefinition(settings.modelId)
          : null,
      },
      defaults: { runnerId: defaultAgentRunnerId(), modelId: defaultAgentModelId() },
    };
  }

  async function getRunnerInfo() {
    const options = await getAgentOptions();
    return {
      active: options.runners.find((r) => r.id === options.settings.runnerId) ?? options.runners[0],
      available: options.runners,
      settings: options.settings,
      model: options.active.model,
    };
  }

  async function executeWithRunner(request) {
    const settings = await resolveAgentSettings();
    const runner = getRunnerById(settings.runnerId);
    return runner.execute(request, settings, ctx);
  }

  async function executeStreamWithRunner(request, emit) {
    const settings = await resolveAgentSettings();
    const runner = getRunnerById(settings.runnerId);
    if (typeof runner.executeStream !== "function") {
      const result = await runner.execute(request, settings, ctx);
      emit("done", result);
      return;
    }
    await runner.executeStream(request, settings, emit, ctx);
  }

  return {
    resolveAgentSettings,
    getAgentOptions,
    getRunnerInfo,
    executeWithRunner,
    executeStreamWithRunner,
    getRunnerById,
  };
}

/**
 * @param {{ queue: ReturnType<typeof createRequestQueue>, runner: ReturnType<typeof createAgentRunner> }} deps
 */
export function createRequestsRouter({ queue, runner }) {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      res.json(await queue.listRequests());
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const { type, payload = {} } = req.body || {};
      res.status(201).json(await queue.createRequest(type, payload));
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ error: err.message });
      if (err.status === 409) {
        return res.status(409).json({ error: err.message, existingId: err.existingId });
      }
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      res.json(await queue.deleteRequest(req.params.id));
    } catch (err) {
      if (err.message === "request not found") return res.status(404).json({ error: err.message });
      if (err.message === "only pending requests can be removed") {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  });

  router.post("/:id/execute/stream", async (req, res, next) => {
    try {
      const request = await queue.getRequest(req.params.id);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      if (typeof res.flushHeaders === "function") res.flushHeaders();

      const send = (event, data) => {
        if (res.writableEnded) return;
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      try {
        await runner.executeStreamWithRunner(request, send);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        send("error", { message });
        send("done", { providerId: "unknown", status: "failed", message });
      } finally {
        res.end();
      }
    } catch (err) {
      if (err.status === 404) return res.status(404).json({ error: err.message });
      if (err.status === 400) return res.status(400).json({ error: err.message });
      next(err);
    }
  });

  router.post("/:id/execute", async (req, res, next) => {
    try {
      const request = await queue.getRequest(req.params.id);
      res.json(await runner.executeWithRunner(request));
    } catch (err) {
      if (err.status === 404) return res.status(404).json({ error: err.message });
      if (err.status === 400) return res.status(400).json({ error: err.message });
      next(err);
    }
  });

  return router;
}

/**
 * @param {{ runner: ReturnType<typeof createAgentRunner> }} deps
 */
export function createAgentRouter({ runner }) {
  const router = Router();

  router.get("/runner", async (_req, res) => {
    res.json(await runner.getRunnerInfo());
  });

  router.get("/options", async (_req, res) => {
    res.json(await runner.getAgentOptions());
  });

  return router;
}

export { buildPrompt } from "./prompt.js";
export { createStreamEmitter, parseAgentStreamLine } from "./stream.js";
export * from "./registry.js";
