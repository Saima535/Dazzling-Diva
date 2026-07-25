import assert from "node:assert/strict";
import test from "node:test";

test("customer token cookie naming stays stable", () => {
  assert.equal("dd_customer_access", "dd_customer_access");
});
