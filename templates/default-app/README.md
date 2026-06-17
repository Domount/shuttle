# {{projectName}}

A [Loom](https://github.com/your-org/loom) application — normal Node backend + smart agent backend + web client.

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

See `AGENT.md` for the agent protocol and `data/README.md` for JSON contracts.
