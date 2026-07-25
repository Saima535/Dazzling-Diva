import test from "node:test";
import assert from "node:assert/strict";

import { formatMoney } from "@/src/lib/money";

test("formatMoney renders BDT values", () => {
  assert.match(formatMoney(125000), /1,250/);
});
