# Getting started

## Create an app

```bash
npx @domount/create-shuttle-app my-app
cd my-app
npm install
npm run dev
```

- **API:** `http://localhost:3001` (default server port)
- **Web:** `http://localhost:5173` (proxies `/api` to the server)

Ports are configured in `shuttle.config.json`.

## Monorepo development

If you are working inside the Shuttle monorepo:

```bash
git clone git@github.com:Domount/shuttle.git
cd shuttle
npm install
npm test

node cli/create-shuttle/bin/create-shuttle.mjs my-app
```

## Packages

| Package | Purpose |
|---------|---------|
| [`@domount/shuttle`](https://www.npmjs.com/package/@domount/shuttle) | Framework — store, server, agent, verify, scaffold |
| [`@domount/create-shuttle`](https://www.npmjs.com/package/@domount/create-shuttle) | `create-shuttle-app` CLI |

## Verify

```bash
npm run verify        # tiered from git diff
npm run verify:all    # full gate
```

## Scaffold

```bash
npm run scaffold:api -- contacts
npm run scaffold:feature -- contacts
npm run scaffold:skill -- contacts-research
```

## Agent skills (shipped in every app)

| Skill | Purpose |
|-------|---------|
| `skills/optimized-research/` | MCP routing — fast/medium/deep, Parallel/Tavily |
| `skills/change-verification/` | Post-code-edit `npm run verify` gate |

Domain skills you scaffold should load **optimized-research first** when they use external research.

See [Agent protocol](./agent-protocol) and `AGENT.md` in your app.

## Next steps

- [Architecture](./architecture) — code layers, configuration, verification
- [Extending](./extending) — features, skills, custom store
- [API reference](/api/) — package exports
