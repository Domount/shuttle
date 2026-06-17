import test from "node:test";
import assert from "node:assert/strict";

export function greet(name) {
  return `Hello, ${name}!`;
}

test("greet returns greeting", () => {
  assert.equal(greet("Loom"), "Hello, Loom!");
});
