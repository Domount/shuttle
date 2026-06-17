import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../store/index.js";
import { createRequestQueue } from "./index.js";
import { normalizeAgentSettings } from "./registry.js";

test("createRequestQueue creates and lists requests", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-agent-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-agent-mem-"));
  const store = createStore({ dataDir, memoryDir });
  const queue = createRequestQueue({
    store,
    requestTypes: ["message", "research-task"],
    cycleTypes: ["research-task"],
  });

  const item = await queue.createRequest("message", { note: "hello" });
  assert.equal(item.status, "pending");

  const list = await queue.listRequests();
  assert.equal(list.length, 1);
  assert.equal(list[0].type, "message");
});

test("createRequestQueue rejects duplicate cycle types", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-agent-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-agent-mem-"));
  const store = createStore({ dataDir, memoryDir });
  const queue = createRequestQueue({
    store,
    requestTypes: ["research-task"],
    cycleTypes: ["research-task"],
  });

  await queue.createRequest("research-task");
  await assert.rejects(() => queue.createRequest("research-task"), (err) => err.status === 409);
});

test("normalizeAgentSettings defaults", () => {
  const s = normalizeAgentSettings({});
  assert.equal(s.runnerId, "manual");
  assert.equal(s.modelId, "auto");
});
