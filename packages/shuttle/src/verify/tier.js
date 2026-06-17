import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { checkBoundaries } from "./boundaries.js";
import { loadShuttleConfig } from "./config.js";

export const TIERS = {
  0: { name: "cosmetic", label: "Cosmetic — no automated checks" },
  1: { name: "presentational", label: "Presentational — boundaries if TS changed" },
  2: { name: "feature", label: "Feature — boundaries + scoped tests + scoped build" },
  3: { name: "core", label: "Core — boundaries + all tests + web build" },
};

function isCosmeticPath(file) {
  return (
    /\.css$/i.test(file) ||
    /^memory\//.test(file) ||
    /^skills\/.*\.md$/i.test(file) ||
    /^docs\/.*\.md$/i.test(file) ||
    file === "AGENT.md" ||
    file === "README.md" ||
    file === "data/README.md"
  );
}

/**
 * @param {string} file
 * @param {string[]} corePaths
 */
function isCorePath(file, corePaths) {
  return corePaths.some((prefix) => {
    if (prefix.endsWith("/")) return file.startsWith(prefix);
    return file === prefix || file.startsWith(prefix);
  });
}

function hasLogicPaths(files) {
  return files.some(
    (f) =>
      f.startsWith("shared/") ||
      f.startsWith("server/") ||
      f.includes("/use") ||
      f.includes("/lib/") ||
      f.includes("/api/") ||
      f.startsWith("scripts/"),
  );
}

/**
 * @param {string[] | null} files
 * @param {boolean} forceAll
 * @param {string[]} corePaths
 */
export function detectTier(files, forceAll, corePaths) {
  if (forceAll) return 3;
  if (!files || files.length === 0) return 3;
  if (files.every(isCosmeticPath)) return 0;
  if (files.some((f) => isCorePath(f, corePaths))) return 3;
  if (files.some((f) => f.startsWith("shared/"))) return 3;
  if (files.some((f) => f.startsWith("server/") || f.startsWith("scripts/"))) return 2;

  const webFiles = files.filter((f) => f.startsWith("web/"));
  if (webFiles.length > 0) {
    if (!hasLogicPaths(files)) {
      const tsChanged = webFiles.some((f) => /\.(ts|tsx)$/i.test(f));
      return tsChanged ? 1 : 0;
    }
    return 2;
  }

  return 1;
}

/**
 * @param {string[]} files
 * @param {Record<string, string[]>} scopedTests
 * @param {string} root
 */
export function resolveScopedTests(files, scopedTests, root) {
  const tests = new Set();
  for (const file of files) {
    for (const [prefix, paths] of Object.entries(scopedTests)) {
      if (file.startsWith(prefix) || file.includes(prefix.replace(/\//g, path.sep))) {
        for (const t of paths) tests.add(t);
      }
    }
  }
  if (tests.size === 0) return null;
  return [...tests].filter((t) => existsSync(path.join(root, t)));
}

export function collectChangedFiles(root) {
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: root, stdio: "ignore" });
    const out = execSync(
      "git diff --name-only HEAD 2>/dev/null; git diff --name-only --cached 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null",
      { cwd: root, encoding: "utf8" },
    );
    return [...new Set(out.split("\n").filter(Boolean))];
  } catch {
    return null;
  }
}

function needsWebBuild(files, tier, forceAll) {
  if (forceAll || tier >= 3) return true;
  if (tier === 0) return false;
  return files.some((f) => f.startsWith("web/") || f.startsWith("shared/"));
}

/**
 * @param {{ root?: string, tier?: number, all?: boolean, onLog?: (msg: string) => void }} options
 */
export function verifyTier(options = {}) {
  const root = options.root ?? process.cwd();
  const log = options.onLog ?? ((msg) => console.log(msg));
  const config = loadShuttleConfig(root);
  const corePaths = config.verify?.corePaths ?? [];
  const scopedTests = config.verify?.scopedTests ?? {};
  const forceAll = options.all ?? false;
  const changed = collectChangedFiles(root);
  const tier = options.tier ?? detectTier(changed, forceAll, corePaths);
  const meta = TIERS[tier] ?? TIERS[3];

  log("=== Shuttle verify (tiered) ===");
  if (changed?.length) {
    log(`Changed files (${changed.length}): ${changed.slice(0, 8).join(", ")}${changed.length > 8 ? "…" : ""}`);
  } else if (changed === null) {
    log("Not in git — running tier 3 checks");
  } else {
    log("No changed files detected — running tier 3 checks");
  }
  log(`Tier ${tier}: ${meta.label}`);
  log("");

  if (tier === 0) {
    log("=== Tier 0 — skip automated checks ===");
    return { ok: true, tier, skipped: true };
  }

  let failed = 0;
  const tsChanged = changed?.some((f) => /\.(ts|tsx|js|mjs)$/i.test(f) && !isCosmeticPath(f)) ?? true;

  if (tier >= 1 && (tier >= 2 || tsChanged)) {
    const { ok, violations } = checkBoundaries({ root });
    if (ok) log("✓ boundaries");
    else {
      log("✗ boundaries FAILED");
      for (const v of violations) log(`  - ${v}`);
      failed = 1;
    }
  } else {
    log("⊘ boundaries skipped");
  }

  if (tier >= 1 && (tier >= 2 || tsChanged)) {
    try {
      log("→ npm run lint");
      execSync("npm run lint", { cwd: root, stdio: "inherit" });
      log("✓ lint");
    } catch {
      log("✗ lint FAILED");
      failed = 1;
    }
  } else {
    log("⊘ lint skipped");
  }

  if (tier >= 2) {
    try {
      if (tier >= 3) {
        log("→ cd server && npm test");
        execSync("cd server && npm test", { cwd: root, stdio: "inherit" });
      } else {
        const scoped = changed ? resolveScopedTests(changed, scopedTests, root) : null;
        if (scoped?.length) {
          const args = scoped.map((t) => `"${t}"`).join(" ");
          log(`→ node --test ${args}`);
          execSync(`node --test ${args}`, { cwd: root, stdio: "inherit" });
        } else {
          log("→ cd server && npm test");
          execSync("cd server && npm test", { cwd: root, stdio: "inherit" });
        }
      }
      log("✓ tests");
    } catch {
      log("✗ tests FAILED");
      failed = 1;
    }
  } else {
    log("⊘ tests skipped");
  }

  const files = changed ?? [];
  if (needsWebBuild(files, tier, forceAll)) {
    try {
      log("→ cd web && npm run build");
      execSync("cd web && npm run build", { cwd: root, stdio: "inherit" });
      log("✓ web build");
    } catch {
      log("✗ web build FAILED");
      failed = 1;
    }
  } else {
    log("⊘ web build skipped");
  }

  return { ok: failed === 0, tier, failed: failed === 1 };
}

export { checkBoundaries } from "./boundaries.js";
export { loadShuttleConfig } from "./config.js";
