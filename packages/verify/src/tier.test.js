import test from "node:test";
import assert from "node:assert/strict";
import { detectTier } from "./tier.js";

test("detectTier returns 0 for cosmetic-only changes", () => {
  assert.equal(
    detectTier(["web/src/styles.css", "memory/active/foo.md"], false, []),
    0,
  );
});

test("detectTier returns 3 for shared changes", () => {
  assert.equal(detectTier(["shared/helpers.js"], false, []), 3);
});

test("detectTier returns 3 for core paths from config", () => {
  const core = ["server/src/providers/"];
  assert.equal(detectTier(["server/src/providers/foo.js"], false, core), 3);
});

test("detectTier forceAll returns 3", () => {
  assert.equal(detectTier(["web/src/styles.css"], true, []), 3);
});
