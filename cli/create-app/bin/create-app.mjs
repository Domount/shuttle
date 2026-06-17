#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.resolve(__dirname, "../../../templates/default-app");

function render(content, vars) {
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function copyTemplate(src, dest, vars) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const name of readdirSync(src)) {
      copyTemplate(path.join(src, name), path.join(dest, name), vars);
    }
    return;
  }
  const content = readFileSync(src, "utf8");
  const isText = !/\.(png|jpg|ico)$/i.test(src);
  writeFileSync(dest, isText ? render(content, vars) : content);
}

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: create-loom-app <project-name-or-path>");
  process.exit(1);
}

const target = path.resolve(process.cwd(), arg);
const projectName = path.basename(target);
if (existsSync(target)) {
  console.error(`Directory already exists: ${target}`);
  process.exit(1);
}

const vars = {
  projectName,
  serverPort: "4600",
  webPort: "4601",
  loomRoot: path.resolve(__dirname, "../../.."),
};

copyTemplate(TEMPLATE_ROOT, target, vars);
console.log(`Created Loom app: ${target}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${projectName}`);
console.log("  npm install");
console.log("  npm run dev");
