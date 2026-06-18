#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SHUTTLE_ICON_PATH =
  "M11 11.5h6.5c2.2 0 3.5 1.1 3.5 2.6 0 1.2-.7 2.1-2 2.5l3.2 5.4H14.8l-2.8-4.8H11v4.8H8V11.5h3zm3 3.8h2.8c.8 0 1.2-.4 1.2-.9s-.4-.9-1.2-.9H14v1.8z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="#3b82f6"/>
  <path d="${SHUTTLE_ICON_PATH}" fill="#fff"/>
</svg>
`;

const targets = [
  "templates/default-app/web/public/favicon.svg",
  "website/public/favicon.svg",
];

for (const rel of targets) {
  const file = path.join(root, rel);
  writeFileSync(file, svg);
  console.log(`Synced icon → ${rel}`);
}

console.log("Update SHUTTLE_ICON_PATH in web/src/components/AppIcon.tsx to match scripts/sync-favicon.mjs");
