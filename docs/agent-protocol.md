# Agent protocol

## Skills

Every Shuttle app ships `skills/optimized-research/` — the base skill for MCP-backed research:

- Decompose questions into fast / medium / deep legs
- Route to Parallel or Tavily MCP tools
- Cite every factual claim

Domain skills (`skills/<your-workflow>/`) load **optimized-research first**, then apply project-specific scope and output schemas.

## Request queue

- Pending jobs live in `data/requests/` as JSON files
- Cycle types allow one pending job each (configurable in `shuttle.config.json`)
- Agents scan for `"status": "pending"` at session start

## Memory

- `memory/active/` — read every session (preferences, principles)
- `memory/archive/` — historical context when needed

## Verification gate

After code edits, agents must run `npm run verify` before marking tasks done (`skills/change-verification/`).
