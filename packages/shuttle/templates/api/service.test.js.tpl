import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "@domount/shuttle/store";
import { create{{Feature}}Service } from "./{{featureKebab}}.service.js";

test("{{feature}} service lists items", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-{{featureKebab}}-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-mem-"));
  const store = createStore({ dataDir, memoryDir });
  const service = create{{Feature}}Service(store);
  await store.writeJson("{{featureKebab}}/a.json", { id: "a", name: "Alpha" });
  const list = await service.list();
  assert.equal(list.length, 1);
});
