# {{projectName}}

A [Shuttle](https://www.npmjs.com/package/@domount/shuttle) application — normal Node backend + smart agent backend + web client.

## Run

```bash
npm install
npm run dev
```

- API: http://localhost:{{serverPort}}
- Web: http://localhost:{{webPort}} (proxies `/api` to the server)

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

## Agent skills (shipped)

| Skill | Role |
|-------|------|
| `skills/optimized-research/` | MCP research routing (fast/medium/deep) |
| `skills/change-verification/` | Post-code-edit verify gate |

Add domain skills with `npm run scaffold:skill -- your-workflow`.

See `AGENT.md` for the agent protocol and `data/README.md` for JSON contracts.
