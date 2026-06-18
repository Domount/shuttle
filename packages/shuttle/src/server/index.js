import express from "express";
import cors from "cors";
import { config as loadDotenv } from "dotenv";
import path from "node:path";

const { Router } = express;

/**
 * @param {{ envPath?: string }} [options]
 */
export function loadEnv(options = {}) {
  const envPath = options.envPath ?? path.join(process.cwd(), "server", ".env");
  loadDotenv({ path: envPath });
}

/**
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => unknown} fn
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * @param {{ routes?: { path: string, router: import('express').Router }[], cors?: boolean }} [options]
 */
export function createApp(options = {}) {
  const app = express();
  if (options.cors !== false) app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true, at: new Date().toISOString() }));

  for (const { path: mountPath, router } of options.routes ?? []) {
    app.use(mountPath, router);
  }

  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message || "internal error" });
  });

  return app;
}

/**
 * Read-only JSON collection routes.
 * @param {{ store: import('../store/index.js').Store, relDir: string, idField?: string }} options
 */
export function createJsonRoutes({ store, relDir, idField }) {
  const router = express.Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const items = await store.listJson(relDir);
      res.json(items);
    }),
  );

  if (idField) {
    router.get(
      "/:id",
      asyncHandler(async (req, res) => {
        const found = await store.findJsonFileByField(relDir, idField, req.params.id);
        if (!found) {
          const err = new Error("not found");
          err.status = 404;
          throw err;
        }
        res.json(found.data);
      }),
    );
  }

  return router;
}

export { express, Router };
