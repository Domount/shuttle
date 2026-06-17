# Shuttle architecture

Shuttle apps have four code layers and two agent layers.

## Code layers

1. **`data/`** — JSON source of truth (never ES-imported)
2. **`shared/`** — Tested pure logic
3. **`server/`** — Express API (routes → services → store)
4. **`web/`** — React SPA (feature folders)

## Agent layers

1. **`skills/`** — Step-by-step agent workflows
2. **`memory/`** — Active summaries + archive

## Two backends

The **normal backend** serves CRUD, deterministic logic, and external providers. The **smart backend** (Cursor agent + skills) writes research artifacts and qualitative fields agents handle better than code.

## Configuration

`shuttle.config.json` at the project root: ports, request types, verify maps, agent defaults.

## Verification

Tier 0–3 via `npm run verify`. See `@domount/shuttle/verify`.
