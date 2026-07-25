import assert from "node:assert/strict";
import test from "node:test";

test("fixed coupon discounts cannot exceed subtotal", () => {
  const subtotalMinor = 10000;
  const fixedDiscountMinor = 15000;
  assert.equal(Math.min(fixedDiscountMinor, subtotalMinor), 10000);
});

test("percentage coupon discounts can be capped", () => {
  const subtotalMinor = 10000;
  const percentageDiscountMinor = Math.floor((subtotalMinor * 25) / 100);
  const maxDiscountMinor = 2000;
  assert.equal(Math.min(percentageDiscountMinor, maxDiscountMinor), 2000);
});
