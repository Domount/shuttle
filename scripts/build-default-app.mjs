#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templateRoot = path.join(root, "templates/default-app");
const outDir = path.join(root, "build/default-app");
const shuttlePkg = path.join(root, "packages/shuttle");

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

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

const vars = {
  projectName: "shuttle",
  serverPort: "4600",
  webPort: "4601",
  shuttle: existsSync(shuttlePkg) ? `file:${shuttlePkg}` : "^0.1.2",
};

console.log("Building default app → build/default-app");

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}

mkdirSync(path.dirname(outDir), { recursive: true });
copyTemplate(templateRoot, outDir, vars);

run("npm install", outDir);
run("npm test", outDir);

console.log("\nDefault app ready in build/default-app");
console.log("  npm run dev:app     # start API + web");
console.log("  npm run verify:app  # run verify gate");
