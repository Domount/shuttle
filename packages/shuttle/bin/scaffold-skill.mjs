#!/usr/bin/env node
import { scaffoldSkill } from "../src/scaffold/index.js";

const name = process.argv[2];
if (!name) {
  console.error("Usage: shuttle-scaffold-skill <skill-name>");
  process.exit(1);
}
const result = scaffoldSkill(process.cwd(), name);
console.log("Created skill:", result.skill);
console.log(" ", result.file);
