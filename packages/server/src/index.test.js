import test from "node:test";
import assert from "node:assert/strict";
import { createApp, asyncHandler } from "./index.js";

test("createApp mounts health endpoint", async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await res.json();
    assert.equal(body.ok, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("asyncHandler passes errors to next", async () => {
  const err = new Error("boom");
  err.status = 400;
  const handler = asyncHandler(async () => {
    throw err;
  });
  let passed = null;
  await new Promise((resolve) => {
    handler({}, {}, (e) => {
      passed = e;
      resolve();
    });
  });
  assert.equal(passed, err);
});
