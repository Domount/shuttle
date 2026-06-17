#!/usr/bin/env node
import { scaffoldFeature } from "../src/scaffold/index.js";

const name = process.argv[2];
if (!name) {
  console.error("Usage: shuttle-scaffold-feature <FeatureName>");
  process.exit(1);
}
const result = scaffoldFeature(process.cwd(), name);
console.log("Created feature:", result.feature);
for (const f of result.files) console.log(" ", f);
