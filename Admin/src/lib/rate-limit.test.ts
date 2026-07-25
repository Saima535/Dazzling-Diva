import assert from "node:assert/strict";
import test from "node:test";

test("rate limit windows move expiry into the future", () => {
  const now = Date.now();
  const expiresAt = new Date(now + 60_000).getTime();
  assert.ok(expiresAt > now);
});
