# Shuttle

[![npm](https://img.shields.io/npm/v/@domount/shuttle.svg)](https://www.npmjs.com/package/@domount/shuttle)
[![license](https://img.shields.io/github/license/Domount/shuttle.svg)](https://github.com/Domount/shuttle/blob/master/LICENSE)
[![docs](https://img.shields.io/badge/docs-domount.github.io%2Fshuttle-blue)](https://domount.github.io/shuttle/)

**Shuttle** is a local agentic app framework: a **normal Node backend** (Express + JSON store) plus a **smart agent backend** (skills, memory, request queue, Cursor runners) and a **React web client**.

**Documentation:** [domount.github.io/shuttle](https://domount.github.io/shuttle/)

Published by [@domount](https://www.npmjs.com/org/domount).

## Community

| | |
|---|---|
| [Contributing](CONTRIBUTING.md) | Development setup, PR guidelines |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards |
| [Security](SECURITY.md) | Report vulnerabilities privately |
| [Changelog](CHANGELOG.md) | Release history |

If Shuttle helps you, consider [supporting the project on Liberapay](https://liberapay.com/domount/).

## Packages

| Package | Purpose |
|---------|---------|
| [`@domount/shuttle`](https://www.npmjs.com/package/@domount/shuttle) | Framework — store, server, agent, verify, scaffold, eslint-config |
| [`@domount/create-shuttle`](https://www.npmjs.com/package/@domount/create-shuttle) | `create-shuttle-app` CLI |

## Create an app

```bash
npx @domount/create-shuttle my-app
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
git clone git@github.com:Domount/shuttle.git
cd shuttle
npm install
npm test
```

## Documentation site

```bash
npm run docs:dev      # local preview at http://localhost:5173/shuttle/
npm run docs:build    # production build
npm run docs:preview  # preview build output
```

Docs deploy automatically to GitHub Pages on push to `master`.

## Release

```bash
npm login
npm run release:dry   # dry run
npm run release       # publish @domount/shuttle + @domount/create-shuttle
```

Bump `version` in both `packages/shuttle/package.json` and `cli/create-shuttle/package.json` before each release (keep in sync).

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

## License

[MIT](LICENSE)
