#!/usr/bin/env node
import { verifyTier } from "../src/tier.js";

let forceAll = false;
let forceTier = null;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--all") forceAll = true;
  if (argv[i] === "--tier" && argv[i + 1]) forceTier = Number(argv[++i]);
}

const result = verifyTier({ root: process.cwd(), all: forceAll, tier: forceTier ?? undefined });
if (result.ok) {
  console.log("=== Automated checks passed ===");
  process.exit(0);
}
console.error("=== Automated checks FAILED ===");
process.exit(1);
