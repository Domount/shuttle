import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStore } from "@domount/shuttle/store";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

export const store = createStore({
  dataDir: path.join(projectRoot, "data"),
  memoryDir: path.join(projectRoot, "memory"),
});
