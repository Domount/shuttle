import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * @typedef {object} Store
 * @property {() => string} dataDir
 * @property {() => string} memoryDir
 * @property {(rel: string, fallback?: unknown) => Promise<unknown>} readJson
 * @property {(rel: string, data: unknown) => Promise<void>} writeJson
 * @property {(relDir: string) => Promise<unknown[]>} listJson
 * @property {(relDir: string, field: string, value: unknown) => Promise<{ fileName: string, data: unknown } | null>} findJsonFileByField
 * @property {(rel: string) => Promise<void>} deleteJson
 * @property {(name: string) => Promise<string>} readMemoryFile
 * @property {(relDir: string) => Promise<{ file: string, sizeBytes: number, updatedAt: string }[]>} listMemoryFiles
 * @property {(name: string, content: string) => Promise<void>} writeMemoryFile
 */

/**
 * @param {{ dataDir?: string, memoryDir?: string }} [options]
 * @returns {Store}
 */
export function createStore(options = {}) {
  const dataDirPath = process.env.SHUTTLE_DATA_DIR || options.dataDir;
  const memoryDirPath = process.env.SHUTTLE_MEMORY_DIR || options.memoryDir;

  if (!dataDirPath || !memoryDirPath) {
    throw new Error("createStore requires dataDir and memoryDir (or SHUTTLE_DATA_DIR / SHUTTLE_MEMORY_DIR)");
  }

  /** @returns {string} */
  function dataDir() {
    return dataDirPath;
  }

  /** @returns {string} */
  function memoryDir() {
    return memoryDirPath;
  }

  async function readJson(rel, fallback = null) {
    try {
      return JSON.parse(await fs.readFile(path.join(dataDir(), rel), "utf8"));
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return fallback;
      throw err;
    }
  }

  async function writeJson(rel, data) {
    const file = path.join(dataDir(), rel);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  }

  async function listJson(relDir) {
    const dir = path.join(dataDir(), relDir);
    let files;
    try {
      files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return [];
      throw err;
    }
    return Promise.all(
      files.map(async (f) => JSON.parse(await fs.readFile(path.join(dir, f), "utf8"))),
    );
  }

  async function findJsonFileByField(relDir, field, value) {
    const dir = path.join(dataDir(), relDir);
    let files;
    try {
      files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return null;
      throw err;
    }
    for (const fileName of files) {
      const data = JSON.parse(await fs.readFile(path.join(dir, fileName), "utf8"));
      if (data[field] === value) return { fileName, data };
    }
    return null;
  }

  async function deleteJson(rel) {
    await fs.unlink(path.join(dataDir(), rel));
  }

  async function readMemoryFile(name) {
    try {
      return await fs.readFile(path.join(memoryDir(), name), "utf8");
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return "";
      throw err;
    }
  }

  async function listMemoryFiles(relDir) {
    const dir = path.join(memoryDir(), relDir);
    try {
      const files = await fs.readdir(dir);
      return Promise.all(
        files
          .filter((file) => !file.startsWith("."))
          .sort()
          .map(async (file) => {
            const stat = await fs.stat(path.join(dir, file));
            return { file, sizeBytes: stat.size, updatedAt: stat.mtime.toISOString() };
          }),
      );
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return [];
      throw err;
    }
  }

  async function writeMemoryFile(name, content) {
    const file = path.join(memoryDir(), name);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, content);
  }

  return {
    dataDir,
    memoryDir,
    readJson,
    writeJson,
    listJson,
    findJsonFileByField,
    deleteJson,
    readMemoryFile,
    listMemoryFiles,
    writeMemoryFile,
  };
}
