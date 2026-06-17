# Hello Agent — example Shuttle app

Demonstrates the dual-backend pattern: Express API + agent panel with `research-task` requests.

## Run

```bash
npm install
npm run dev
```

## What's here

- `skills/optimized-research/` — MCP routing (Parallel/Tavily)
- `skills/research-task/` — domain skill writing `data/notes/<id>.json`
- `AGENT.md` — agent protocol for this app

## Ports

- API: http://localhost:4700
- Web: http://localhost:4701
