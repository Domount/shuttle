#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

console.log(dryRun ? "Dry-run release (@domount/*)" : "Publishing @domount/* packages");

run("node scripts/sync-favicon.mjs");
run("node scripts/sync-create-shuttle-template.mjs");
run("npm test");

const publishCmd = dryRun
  ? "npm publish --workspaces --if-present --dry-run"
  : "npm publish --workspaces --if-present";

run(publishCmd);

console.log(dryRun ? "\nDry run complete. Re-run without --dry-run to publish." : "\nPublished @domount/shuttle and @domount/create-shuttle.");
