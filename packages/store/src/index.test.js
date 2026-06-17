import { mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "./index.js";

test("createStore reads and writes JSON", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-store-data-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-store-mem-"));
  const store = createStore({ dataDir, memoryDir });

  await store.writeJson("items/a.json", { id: 1, name: "alpha" });
  const item = await store.readJson("items/a.json");
  assert.equal(item.name, "alpha");

  const list = await store.listJson("items");
  assert.equal(list.length, 1);

  const found = await store.findJsonFileByField("items", "id", 1);
  assert.ok(found);
  assert.equal(found.fileName, "a.json");

  await store.deleteJson("items/a.json");
  assert.equal(await store.readJson("items/a.json"), null);
});

test("createStore memory helpers", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-store-data-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-store-mem-"));
  const store = createStore({ dataDir, memoryDir });

  await store.writeMemoryFile("active/notes.md", "# Notes");
  assert.equal(await store.readMemoryFile("active/notes.md"), "# Notes");

  const files = await store.listMemoryFiles("active");
  assert.equal(files.length, 1);
  assert.equal(files[0].file, "notes.md");
});

test("createStore respects LOOM_DATA_DIR env", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "loom-store-env-"));
  const memoryDir = await mkdtemp(path.join(tmpdir(), "loom-store-mem-"));
  const prev = process.env.LOOM_DATA_DIR;
  process.env.LOOM_DATA_DIR = dataDir;
  try {
    const store = createStore({ dataDir: "/should-not-use", memoryDir });
    await store.writeJson("env.json", { ok: true });
    const raw = await readFile(path.join(dataDir, "env.json"), "utf8");
    assert.match(raw, /"ok": true/);
  } finally {
    if (prev === undefined) delete process.env.LOOM_DATA_DIR;
    else process.env.LOOM_DATA_DIR = prev;
  }
});
