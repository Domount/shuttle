# @domount/create-shuttle

[![npm version](https://img.shields.io/npm/v/@domount/create-shuttle.svg)](https://www.npmjs.com/package/@domount/create-shuttle)
[![license](https://img.shields.io/npm/l/@domount/create-shuttle.svg)](https://github.com/Domount/shuttle/blob/main/LICENSE)

Scaffold a new [Shuttle](https://domount.github.io/shuttle/) application — Express backend, agent skills, memory, request queue, and React web client.

## Usage

```bash
npx @domount/create-shuttle-app my-app
cd my-app
npm install
npm run dev
```

## What you get

- **Server** — Express API with config and memory routes
- **Web** — React SPA with feature-folder layout
- **Agent layer** — `AGENT.md`, skills (`optimized-research`, `change-verification`), memory
- **Data** — JSON store contracts in `data/`
- **Tooling** — `shuttle.config.json`, verify scripts, scaffold commands

## Options

The CLI accepts a single positional argument — the project directory name:

```bash
npx @domount/create-shuttle-app ./my-custom-path
```

## Requirements

- Node.js >= 18

## Docs

Full documentation: [domount.github.io/shuttle](https://domount.github.io/shuttle/)

## License

[MIT](https://github.com/Domount/shuttle/blob/main/LICENSE)
