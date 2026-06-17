# Agent protocol

Every Loom app ships `AGENT.md` as the agent entry contract.

## Session protocol

1. Read `memory/active/*`
2. Process `data/requests/` pending jobs
3. Follow the task matrix for each request type

## Request queue

- Website writes `data/requests/<file>.json` with `status: pending`
- Cycle types allow one pending job each (configurable in `loom.config.json`)
- Runners: `manual`, `cursor-cli`, `cursor-sdk`

## runMeta

Agent artifacts should include:

```json
{
  "runMeta": {
    "at": "ISO-8601",
    "model": "auto",
    "skills": ["skill-name"],
    "tools": []
  }
}
```

## After code changes

Run `npm run verify` per `skills/change-verification/SKILL.md`.
