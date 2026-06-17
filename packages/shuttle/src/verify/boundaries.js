import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const EXT = [".ts", ".tsx", ".js", ".jsx"];
const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/g;

/**
 * @param {string} dir
 * @param {string[]} [acc]
 */
function walk(dir, acc = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (EXT.some((e) => name.endsWith(e))) acc.push(p);
  }
  return acc;
}

function extractImports(content) {
  const specs = [];
  let m;
  while ((m = IMPORT_RE.exec(content))) specs.push(m[1]);
  return specs;
}

/**
 * @param {string} root
 * @param {string} spec
 */
function resolveSpec(root, fromFile, spec, paths) {
  const { webSrc, serverSrc, shared } = paths;
  if (spec.startsWith("@shared/")) {
    return { kind: "shared", abs: join(shared, spec.slice("@shared/".length)) };
  }
  if (spec.startsWith("#shared/")) {
    return { kind: "shared", abs: join(shared, spec.slice("#shared/".length)) };
  }
  if (spec.startsWith("@web/")) {
    return { kind: "web-alias", abs: join(webSrc, spec.slice("@web/".length)) };
  }
  if (spec.startsWith("#server/")) {
    return { kind: "server-alias", abs: join(serverSrc, spec.slice("#server/".length)) };
  }
  if (!spec.startsWith(".")) return { kind: "external" };
  return { kind: "local", abs: resolve(dirname(fromFile), spec) };
}

function classifyWebFile(webSrc, absPath) {
  const rel = relative(webSrc, absPath).replace(/\\/g, "/");
  if (rel === "App.tsx") return { layer: "app" };
  if (rel.startsWith("features/")) {
    const [, feature] = rel.split("/");
    return { layer: "feature", feature };
  }
  if (rel.startsWith("components/")) return { layer: "components" };
  if (rel.startsWith("lib/")) return { layer: "lib" };
  if (rel.startsWith("api/")) return { layer: "api" };
  if (rel === "types.ts" || rel.startsWith("theme/")) return { layer: "types" };
  return { layer: "other", rel };
}

function classifyTarget(paths, fromFile, spec, resolved) {
  const { webSrc, serverSrc, shared, root } = paths;
  if (resolved.kind === "external") return { layer: "external" };
  if (resolved.kind === "shared") return { layer: "shared" };
  if (resolved.kind === "server-alias") return { layer: "server" };

  const relFrom = relative(webSrc, fromFile).replace(/\\/g, "/");
  let target = resolved.kind === "web-alias" || resolved.kind === "local" ? resolved.abs : null;
  if (!target) return { layer: "unresolved" };

  const tryPaths = [target];
  for (const ext of EXT) {
    tryPaths.push(target + ext);
    tryPaths.push(join(target, `index${ext}`));
  }

  let hit = null;
  for (const p of tryPaths) {
    if (statSync(p, { throwIfNoEntry: false })) {
      hit = p;
      break;
    }
  }
  if (!hit) return { layer: "unresolved" };

  target = hit;
  if (target.startsWith(shared)) return { layer: "shared" };
  if (target.startsWith(serverSrc)) return { layer: "server" };
  if (!target.startsWith(webSrc)) return { layer: "outside" };

  const rel = relative(webSrc, target).replace(/\\/g, "/");
  if (rel.startsWith("features/")) {
    const [, feature] = rel.split("/");
    const [, fromFeature] = relFrom.startsWith("features/") ? relFrom.split("/") : [null, null];
    if (fromFeature && feature === fromFeature) return { layer: "same-feature", feature };
    return { layer: "feature", feature };
  }
  if (rel.startsWith("components/")) return { layer: "components" };
  if (rel.startsWith("lib/")) return { layer: "lib" };
  if (rel.startsWith("api/")) return { layer: "api" };
  if (rel === "types.ts" || rel.startsWith("theme/")) return { layer: "types" };
  return { layer: "other", rel };
}

function checkWebImport(root, fromFile, spec, from, to) {
  if (to.layer === "unresolved" || to.layer === "external") return null;
  const fromRel = relative(root, fromFile);

  if (from.layer === "components") {
    if (to.layer === "feature") {
      return `${fromRel} must not import feature "${to.feature}" (${spec}).`;
    }
    if (to.layer === "api") {
      return `${fromRel} must not import api (${spec}).`;
    }
  }

  if (from.layer === "lib") {
    if (to.layer === "feature") {
      return `${fromRel} must not import feature "${to.feature}" (${spec}).`;
    }
    if (to.layer === "components" || to.layer === "api") {
      return `${fromRel} must not import ${to.layer} (${spec}).`;
    }
  }

  if (from.layer === "api" && !["types", "external", "same-feature"].includes(to.layer)) {
    if (to.layer !== "types" && !(to.layer === "other" && to.rel === "types.ts")) {
      return `${fromRel} should only import types (${spec}).`;
    }
  }

  if (from.layer === "feature" && to.layer === "feature" && to.feature !== from.feature) {
    return `${fromRel} must not import feature "${to.feature}" (${spec}).`;
  }

  if (from.layer === "app" && to.layer === "feature") {
    const pageOk = spec.startsWith(`@web/features/${to.feature}/`) && /Page(\.tsx)?$/.test(spec);
    if (!pageOk && !spec.match(/Page(\.tsx)?$/)) {
      return `App.tsx should only import feature Page entry points, not (${spec}).`;
    }
  }

  if (to.layer === "server") {
    return `${fromRel} must not import server code (${spec}).`;
  }

  return null;
}

function serverLayer(serverSrc, file) {
  const rel = relative(serverSrc, file).replace(/\\/g, "/");
  if (rel.startsWith("routes/")) return "routes";
  if (rel.startsWith("services/")) return "services";
  if (rel.startsWith("providers/")) return "providers";
  if (rel === "app.js" || rel === "index.js") return "app";
  return "other";
}

function checkServerImport(root, serverSrc, fromFile, spec, resolved) {
  if (spec.includes("web/") || spec.includes("web/src") || spec.startsWith("@web/")) {
    return `${relative(root, fromFile)} must not import web (${spec}).`;
  }
  if (resolved.kind === "shared") return null;
  if (resolved.kind !== "local" && resolved.kind !== "server-alias") return null;

  const from = serverLayer(serverSrc, fromFile);
  const toRel = relative(serverSrc, resolved.abs).replace(/\\/g, "/");
  const fromRel = relative(root, fromFile);

  if (from === "routes" && toRel.startsWith("providers/")) {
    return `${fromRel} must not import providers (${spec}).`;
  }
  if (from === "services" && toRel.startsWith("routes/")) {
    return `${fromRel} must not import routes (${spec}).`;
  }
  if (from === "providers" && (toRel.startsWith("services/") || toRel.startsWith("routes/"))) {
    return `${fromRel} must not import services/routes (${spec}).`;
  }
  return null;
}

function checkSharedImport(root, paths, fromFile, spec, resolved) {
  const { webSrc, serverSrc } = paths;
  if (resolved.kind === "local") {
    if (resolved.abs.startsWith(webSrc) || resolved.abs.startsWith(serverSrc)) {
      return `${relative(root, fromFile)} must not import app/server (${spec}).`;
    }
  }
  if (
    spec.startsWith("../web") ||
    spec.startsWith("../server") ||
    spec.startsWith("@web/") ||
    spec.startsWith("#server/")
  ) {
    return `${relative(root, fromFile)} must not import app/server (${spec}).`;
  }
  return null;
}

/**
 * @param {{ root?: string }} [options]
 * @returns {{ ok: boolean, violations: string[] }}
 */
export function checkBoundaries(options = {}) {
  const root = options.root ?? process.cwd();
  const paths = {
    root,
    webSrc: join(root, "web/src"),
    serverSrc: join(root, "server/src"),
    shared: join(root, "shared"),
  };

  const violations = [];

  for (const file of walk(paths.webSrc)) {
    const content = readFileSync(file, "utf8");
    const from = classifyWebFile(paths.webSrc, file);
    for (const spec of extractImports(content)) {
      const resolved = resolveSpec(root, file, spec, paths);
      const to = classifyTarget(paths, file, spec, resolved);
      const msg = checkWebImport(root, file, spec, from, to);
      if (msg) violations.push(msg);
    }
  }

  for (const file of walk(paths.serverSrc)) {
    const content = readFileSync(file, "utf8");
    for (const spec of extractImports(content)) {
      const resolved = resolveSpec(root, file, spec, paths);
      const msg = checkServerImport(root, paths.serverSrc, file, spec, resolved);
      if (msg) violations.push(msg);
    }
  }

  for (const file of walk(paths.shared)) {
    if (file.endsWith(".test.js")) continue;
    const content = readFileSync(file, "utf8");
    for (const spec of extractImports(content)) {
      const resolved = resolveSpec(root, file, spec, paths);
      const msg = checkSharedImport(root, paths, file, spec, resolved);
      if (msg) violations.push(msg);
    }
  }

  return { ok: violations.length === 0, violations };
}
