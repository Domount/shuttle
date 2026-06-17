/**
 * @param {string} input
 */
export function parseFeatureName(input) {
  const raw = input.trim();
  if (!raw) throw new Error("Feature name is required");
  const pascal = raw.replace(/(^|-)([a-z])/gi, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "");
  const kebab = raw
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  return { pascal, kebab, camel, raw };
}

/**
 * @param {string} template
 * @param {Record<string, string>} vars
 */
export function renderTemplate(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

/**
 * @param {string} filePath
 * @param {import('node:fs').PathLike} content
 */
export async function writeIfMissing(filePath, content, fs) {
  const { existsSync, writeFileSync, mkdirSync } = fs;
  if (existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }
  mkdirSync(filePath.substring(0, filePath.lastIndexOf("/")), { recursive: true });
  writeFileSync(filePath, content);
}
