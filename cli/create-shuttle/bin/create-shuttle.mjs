#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundledTemplate = path.resolve(__dirname, "../template");
const monorepoTemplate = path.resolve(__dirname, "../../../templates/default-app");
const TEMPLATE_ROOT = existsSync(path.join(bundledTemplate, "package.json"))
  ? bundledTemplate
  : monorepoTemplate;

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

function shuttleDep(version, monorepoRoot) {
  const monorepoPkg = path.join(monorepoRoot, "packages", "shuttle");
  if (existsSync(monorepoPkg)) {
    return `file:${monorepoPkg}`;
  }
  return `^${version}`;
}

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: create-shuttle-app <project-name-or-path>");
  process.exit(1);
}

const target = path.resolve(process.cwd(), arg);
const projectName = path.basename(target);
if (existsSync(target)) {
  console.error(`Directory already exists: ${target}`);
  process.exit(1);
}

if (!existsSync(TEMPLATE_ROOT)) {
  console.error(`Template not found: ${TEMPLATE_ROOT}`);
  process.exit(1);
}

const createPkg = JSON.parse(
  readFileSync(path.resolve(__dirname, "../package.json"), "utf8"),
);
const monorepoRoot = path.resolve(__dirname, "../../..");
const version = createPkg.version;

const vars = {
  projectName,
  serverPort: "4600",
  webPort: "4601",
  shuttle: shuttleDep(version, monorepoRoot),
};

copyTemplate(TEMPLATE_ROOT, target, vars);
console.log(`Created Shuttle app: ${target}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${projectName}`);
console.log("  npm install");
console.log("  npm run dev");
