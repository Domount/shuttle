# Data contracts

JSON on disk is the source of truth. The server reads via `@domount/shuttle/store`; agents read/write files directly.

## `config.json`

App settings including `agent.runnerId` and `agent.modelId`.

## `requests/<timestamp>-<type>-<id>.json`

Agent job queue from the web UI.

```json
{
  "id": "uuid",
  "type": "research-task | message",
  "payload": {},
  "status": "pending | done",
  "createdAt": "ISO-8601",
  "completedAt": null,
  "response": null
}
```

## Agent artifacts

Add domain collections under `data/<collection>/` as your project grows. Document schemas here.

## `runMeta` (recommended on agent artifacts)

```json
{
  "runMeta": {
    "at": "ISO-8601",
    "model": "auto",
    "skills": ["skill-name"],
    "tools": ["web-search"]
  }
}
```
