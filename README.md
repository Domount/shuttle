# Shuttle

**Shuttle** is a local agentic app framework: a **normal Node backend** (Express + JSON store) plus a **smart agent backend** (skills, memory, request queue, Cursor runners) and a **React web client**.

Published by [@domount](https://www.npmjs.com/org/domount).

## Packages

| Package | Purpose |
|---------|---------|
| `@domount/shuttle` | Framework — store, server, agent, verify, scaffold, eslint-config |
| `@domount/create-shuttle` | `create-shuttle-app <name>` CLI |

## Create an app

```bash
npx @domount/create-shuttle-app my-app
cd my-app
npm install
npm run dev
```

Monorepo dev:

```bash
node cli/create-shuttle/bin/create-shuttle.mjs my-app
```

## Monorepo development

```bash
cd ~/work/loom
npm install
npm test
```

## Release

```bash
npm login
npm run release:dry   # dry run
npm run release       # publish @domount/shuttle + @domount/create-shuttle
```

## Architecture

```
Web (React) → /api → Express (normal backend)
                         ↓
                    data/ JSON + memory/
                         ↑
              Agent (skills + AGENT.md)
```

## Agent skills (shipped in every app)

| Skill | Purpose |
|-------|---------|
| `skills/optimized-research/` | MCP routing — fast/medium/deep, Parallel/Tavily |
| `skills/change-verification/` | Post-code-edit `npm run verify` gate |

Domain skills you scaffold should load **optimized-research first** when they use external research.

See `docs/architecture.md`, `docs/agent-protocol.md`, and `docs/extending.md`.
