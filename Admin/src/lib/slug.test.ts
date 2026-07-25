import test from "node:test";
import assert from "node:assert/strict";

import { slugify } from "@/lib/slug";

test("slugify normalizes labels", () => {
  assert.equal(slugify("  Wedding Collection Deluxe  "), "wedding-collection-deluxe");
});
