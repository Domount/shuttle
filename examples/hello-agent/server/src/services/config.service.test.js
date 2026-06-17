import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "@domount/shuttle/store";
import { normalizeAgentSettings } from "@domount/shuttle/agent";

test("normalizeAgentSettings defaults", () => {
  const s = normalizeAgentSettings({});
  assert.equal(s.runnerId, "manual");
});
