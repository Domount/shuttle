# API reference

## `@domount/shuttle`

### `@domount/shuttle/store`

```js
import { createStore } from "@domount/shuttle/store";

const store = createStore({ dataDir, memoryDir });
```

| Method | Description |
|--------|-------------|
| `readJson(rel, fallback?)` | Read a JSON file under `data/` |
| `writeJson(rel, data)` | Write a JSON file |
| `listJson(relDir)` | List and parse all JSON in a directory |
| `findJsonFileByField(relDir, field, value)` | Find a file by field value |
| `deleteJson(rel)` | Delete a JSON file |
| `readMemoryFile(name)` | Read from `memory/` |
| `writeMemoryFile(name, content)` | Write to `memory/` |
| `listMemoryFiles(relDir)` | List memory files with metadata |

### `@domount/shuttle/server`

```js
import { createApp, loadEnv, asyncHandler } from "@domount/shuttle/server";
```

| Export | Description |
|--------|-------------|
| `loadEnv(options?)` | Load `server/.env` |
| `createApp(options?)` | Express app with JSON body + optional CORS |
| `asyncHandler(fn)` | Wrap async route handlers |

### `@domount/shuttle/agent`

```js
import {
  createRequestQueue,
  createAgentRouter,
  normalizeAgentSettings,
} from "@domount/shuttle/agent";
```

| Export | Description |
|--------|-------------|
| `createRequestQueue({ store, requestTypes, cycleTypes? })` | File-based request queue |
| `createAgentRouter(options)` | Express router for agent runs |
| `normalizeAgentSettings(settings)` | Validate agent config |

Runners: `manual`, `cursor-cli`, `cursor-sdk`.

### `@domount/shuttle/verify`

Tiered verification — re-exported from `@domount/shuttle/verify/tier` and `@domount/shuttle/verify/boundaries`.

CLI: `shuttle-verify`, `shuttle-check-boundaries`.

### `@domount/shuttle/scaffold`

Programmatic scaffolds for features, APIs, and skills. Used by the `shuttle-scaffold-*` binaries.

### `@domount/shuttle/eslint-config`

```js
import { createShuttleEslintConfig } from "@domount/shuttle/eslint-config";

export default createShuttleEslintConfig();
```

## `@domount/create-shuttle`

CLI binary: `create-shuttle-app`

```bash
npx @domount/create-shuttle-app <directory>
```

Scaffolds a full Shuttle app from the bundled template.
