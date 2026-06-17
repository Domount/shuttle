#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(__dirname, "../templates/default-app");
const dest = path.resolve(__dirname, "../cli/create-shuttle/template");

if (!existsSync(source)) {
  console.error(`Template source not found: ${source}`);
  process.exit(1);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}

mkdirSync(dest, { recursive: true });
cpSync(source, dest, { recursive: true });
console.log(`Synced template → cli/create-shuttle/template`);
