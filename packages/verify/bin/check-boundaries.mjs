#!/usr/bin/env node
import { checkBoundaries } from "../src/boundaries.js";

const root = process.cwd();
const { ok, violations } = checkBoundaries({ root });

if (ok) {
  console.log("✓ Boundary check passed");
  process.exit(0);
}

console.error("✗ Boundary violations:\n");
for (const v of violations) console.error(`  - ${v}`);
console.error(`\n${violations.length} violation(s). See docs/architecture/BOUNDARIES.md`);
process.exit(1);
