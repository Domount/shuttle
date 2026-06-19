#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "brand/shuttle-icon.png");

const targets = [
  "templates/default-app/web/public",
  "examples/hello-agent/web/public",
  "website/public",
];

for (const rel of targets) {
  const dir = path.join(root, rel);
  mkdirSync(dir, { recursive: true });

  await sharp(source).png().toFile(path.join(dir, "shuttle-icon.png"));
  await sharp(source).resize(32, 32).png().toFile(path.join(dir, "favicon.png"));
  await sharp(source).resize(180, 180).png().toFile(path.join(dir, "apple-touch-icon.png"));

  console.log(`Synced brand/shuttle-icon.png → ${rel}/`);
}
