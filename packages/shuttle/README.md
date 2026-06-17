# @domount/shuttle

[![npm version](https://img.shields.io/npm/v/@domount/shuttle.svg)](https://www.npmjs.com/package/@domount/shuttle)
[![license](https://img.shields.io/npm/l/@domount/shuttle.svg)](https://github.com/Domount/shuttle/blob/main/LICENSE)

Local agentic app framework — Express backend, JSON store, Cursor agent runners, verification gates, and scaffolds.

**Docs:** [domount.github.io/shuttle](https://domount.github.io/shuttle/)

## Install

```bash
npm install @domount/shuttle
```

Or scaffold a full app:

```bash
npx @domount/create-shuttle-app my-app
```

## Exports

| Import | Purpose |
|--------|---------|
| `@domount/shuttle/store` | JSON file store (`createStore`) |
| `@domount/shuttle/server` | Express helpers (`createApp`, `loadEnv`, `asyncHandler`) |
| `@domount/shuttle/agent` | Request queue, agent runners, settings registry |
| `@domount/shuttle/verify` | Tiered verification entrypoint |
| `@domount/shuttle/verify/boundaries` | Import boundary checks |
| `@domount/shuttle/verify/tier` | Tier 0–3 verify runner |
| `@domount/shuttle/scaffold` | Feature, API, and skill scaffolds |
| `@domount/shuttle/eslint-config` | Shared ESLint config for Shuttle apps |

## CLI binaries

| Command | Purpose |
|---------|---------|
| `shuttle-verify` | Run tiered verification |
| `shuttle-check-boundaries` | Check import boundaries |
| `shuttle-scaffold-feature` | Scaffold a web feature page |
| `shuttle-scaffold-api` | Scaffold server routes + service |
| `shuttle-scaffold-skill` | Scaffold an agent skill |

## Architecture

Shuttle apps combine a **normal backend** (Express + JSON store) with a **smart agent backend** (skills, memory, request queue, Cursor runners) and a React web client.

```
Web (React) → /api → Express
                         ↓
                    data/ + memory/
                         ↑
              Agent (skills + AGENT.md)
```

See the [architecture guide](https://domount.github.io/shuttle/guide/architecture) for layers, configuration, and verification.

## Requirements

- Node.js >= 18
- Optional: `@cursor/sdk` for the Cursor SDK agent runner

## License

[MIT](https://github.com/Domount/shuttle/blob/main/LICENSE)
