import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFeatureName, renderTemplate } from "./names.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES = path.join(__dirname, "../templates");

function tpl(name) {
  return readFileSync(path.join(TEMPLATES, name), "utf8");
}

/**
 * @param {string} root
 * @param {string} featureInput
 */
export function scaffoldFeature(root, featureInput) {
  const { pascal, kebab, camel } = parseFeatureName(featureInput);
  const vars = { Feature: pascal, feature: camel, featureKebab: kebab };
  const featureDir = path.join(root, "web/src/features", kebab);

  const files = {
    [`${featureDir}/${pascal}Page.tsx`]: renderTemplate(tpl("feature/Page.tsx.tpl"), vars),
    [`${featureDir}/use${pascal}Page.ts`]: renderTemplate(tpl("feature/usePage.ts.tpl"), vars),
    [`${featureDir}/${kebab}.css`]: renderTemplate(tpl("feature/page.css.tpl"), vars),
  };

  for (const [filePath, content] of Object.entries(files)) {
    if (existsSync(filePath)) throw new Error(`Already exists: ${filePath}`);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  }

  patchAppTsx(root, pascal, kebab);
  return { feature: kebab, files: Object.keys(files) };
}

function patchAppTsx(root, pascal, kebab) {
  const appPath = path.join(root, "web/src/App.tsx");
  let content = readFileSync(appPath, "utf8");
  const importLine = `import { ${pascal}Page } from "@web/features/${kebab}/${pascal}Page";`;
  if (!content.includes(importLine)) {
    content = content.replace(
      /(import.*from "react-router-dom";?\n)/,
      `$1${importLine}\n`,
    );
  }
  const routeLine = `        <Route path="/${kebab}" element={<${pascal}Page />} />`;
  if (!content.includes(routeLine)) {
    content = content.replace(
      /(\s*<\/Routes>)/,
      `${routeLine}\n$1`,
    );
  }
  const navEntry = `  { to: "/${kebab}", label: "${pascal}" },`;
  if (!content.includes(navEntry)) {
    content = content.replace(/(const NAV = \[\n)/, `$1${navEntry}\n`);
  }
  writeFileSync(appPath, content);
}

/**
 * @param {string} root
 * @param {string} featureInput
 */
export function scaffoldApi(root, featureInput) {
  const { pascal, kebab, camel } = parseFeatureName(featureInput);
  const vars = { Feature: pascal, feature: camel, featureKebab: kebab };
  const servicePath = path.join(root, `server/src/services/${kebab}.service.js`);
  const routePath = path.join(root, `server/src/routes/${kebab}.routes.js`);
  const testPath = path.join(root, `server/src/services/${kebab}.service.test.js`);

  const files = {
    [servicePath]: renderTemplate(tpl("api/service.js.tpl"), vars),
    [routePath]: renderTemplate(tpl("api/routes.js.tpl"), vars),
    [testPath]: renderTemplate(tpl("api/service.test.js.tpl"), vars),
  };

  for (const [filePath, content] of Object.entries(files)) {
    if (existsSync(filePath)) throw new Error(`Already exists: ${filePath}`);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  }

  patchAppJs(root, kebab, pascal);
  patchClientTs(root, pascal, kebab, camel);
  patchLoomConfig(root, kebab, testPath);
  return { feature: kebab, files: Object.keys(files) };
}

function patchAppJs(root, kebab, pascal) {
  const appPath = path.join(root, "server/src/app.js");
  let content = readFileSync(appPath, "utf8");
  const importLine = `import ${kebab}Routes from "#server/routes/${kebab}.routes.js";`;
  if (!content.includes(importLine)) {
    content = content.replace(/(import.*from.*\n)(?=export)/, `$1${importLine}\n`);
  }
  const mountLine = `    { path: "/api/${kebab}", router: ${kebab}Routes },`;
  if (!content.includes(mountLine)) {
    content = content.replace(/(routes: \[\n)/, `$1${mountLine}\n`);
  }
  writeFileSync(appPath, content);
}

function patchClientTs(root, pascal, kebab, camel) {
  const clientPath = path.join(root, "web/src/api/client.ts");
  let content = readFileSync(clientPath, "utf8");
  const method = `  ${camel}List: () => get<${pascal}Item[]>("/${kebab}"),`;
  if (!content.includes(method)) {
    content = content.replace(/(export const api = \{)/, `$1\n${method}`);
  }
  const typeBlock = `export type ${pascal}Item = { id: string; name: string };\n\n`;
  if (!content.includes(`export type ${pascal}Item`)) {
    content = typeBlock + content;
  }
  writeFileSync(clientPath, content);
}

function patchLoomConfig(root, kebab, testPath) {
  const configPath = path.join(root, "loom.config.json");
  if (!existsSync(configPath)) return;
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.verify = config.verify ?? { scopedTests: {}, corePaths: [] };
  config.verify.scopedTests = config.verify.scopedTests ?? {};
  const relTest = path.relative(root, testPath).replace(/\\/g, "/");
  config.verify.scopedTests[`web/src/features/${kebab}/`] = [relTest];
  config.verify.scopedTests[`server/src/services/${kebab}.service`] = [relTest];
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

/**
 * @param {string} root
 * @param {string} skillInput
 */
export function scaffoldSkill(root, skillInput) {
  const kebab = skillInput.trim().toLowerCase().replace(/[\s_]+/g, "-");
  const title = kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const skillDir = path.join(root, "skills", kebab);
  const skillPath = path.join(skillDir, "SKILL.md");
  if (existsSync(skillPath)) throw new Error(`Already exists: ${skillPath}`);
  mkdirSync(skillDir, { recursive: true });
  const content = renderTemplate(tpl("skill/SKILL.md.tpl"), { skillKebab: kebab, skillTitle: title });
  writeFileSync(skillPath, content);
  return { skill: kebab, file: skillPath };
}

export { parseFeatureName, renderTemplate } from "./names.js";
