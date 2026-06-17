import test from "node:test";
import assert from "node:assert/strict";
import { parseFeatureName, renderTemplate } from "./names.js";

test("parseFeatureName", () => {
  const n = parseFeatureName("orders");
  assert.equal(n.pascal, "Orders");
  assert.equal(n.kebab, "orders");
  assert.equal(n.camel, "orders");
});

test("renderTemplate", () => {
  const out = renderTemplate("Hello {{name}}", { name: "Loom" });
  assert.equal(out, "Hello Loom");
});
