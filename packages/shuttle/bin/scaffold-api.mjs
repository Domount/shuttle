#!/usr/bin/env node
import { scaffoldApi } from "../src/scaffold/index.js";

const name = process.argv[2];
if (!name) {
  console.error("Usage: shuttle-scaffold-api <FeatureName>");
  process.exit(1);
}
const result = scaffoldApi(process.cwd(), name);
console.log("Created API:", result.feature);
for (const f of result.files) console.log(" ", f);
