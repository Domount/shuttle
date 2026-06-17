import test from "node:test";
import assert from "node:assert/strict";
import { greet } from "./example.js";

test("greet from example module", () => {
  assert.equal(greet("World"), "Hello, World!");
});
