# Loom

**Loom** is a local agentic app framework: a **normal Node backend** (Express + JSON store) plus a **smart agent backend** (skills, memory, request queue, Cursor runners) and a **React web client**.

## Packages (`@loom/*`)

| Package | Purpose |
|---------|---------|
| `@loom/store` | JSON + memory filesystem I/O |
| `@loom/server` | Express factory, route helpers |
| `@loom/agent` | Request queue, runners, registry |
| `@loom/verify` | Boundaries + tiered verify (`loom-verify`) |
| `@loom/eslint-config` | Shared ESLint flat config |
| `@loom/scaffold` | Feature / API / skill generators |
| `@loom/create-app` | `create-loom-app <name>` CLI |

## Create an app

```bash
node cli/create-app/bin/create-app.mjs my-app
cd my-app
npm install
npm run dev
```

## Monorepo development

```bash
cd ~/work/loom
npm install
npm test
```

## Architecture

```
Web (React) → /api → Express (normal backend)
                         ↓
                    data/ JSON + memory/
                         ↑
              Agent (skills + AGENT.md)
```

See `docs/architecture.md`, `docs/agent-protocol.md`, and `docs/extending.md`.
