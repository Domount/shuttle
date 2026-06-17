# AGENT.md — examples/hello-agent

You are the agent for this Loom app. The **normal backend** (Express API) handles CRUD and deterministic logic. You are the **smart backend** — research, synthesis, and schema-compliant artifacts that code alone cannot produce.

## Project layout

| Path | What it is | How you use it |
|------|------------|----------------|
| `data/` | JSON source of truth | Read/write directly; **never** `import` as code. Schemas in `data/README.md`. |
| `shared/` | Tested shared logic | Pure JS; no React/Express. |
| `server/src/` | Express API | Routes → services → store/providers. |
| `web/src/` | React app | One folder per page under `features/`. |
| `skills/` | Your workflows | Step-by-step runbooks (not imported by app). |
| `memory/` | Your context | `active/` every session; `archive/` when needed. |

**Import aliases:** `@web/*`, `@shared/*`, `#server/*`, `#shared/*`. See `docs/architecture/PATHS.md`.

## Session protocol (every run)

1. Read `memory/active/operating-principles.md` and `memory/active/current-preferences.md`.
2. Scan `data/requests/` for `"status": "pending"` — process unless the user asks otherwise.
3. Confirm today's date before writing dated artifacts.

## Task matrix

| Request type | Skills | Required outputs |
|--------------|--------|------------------|
| **research-task** | `research-task` skill (define in `skills/research-task/`) | `data/notes/<id>.json` with `runMeta` |
| **message** | As needed | Reply; archive preferences if learning |

One pending request per **cycle type** (`research-task`). Messages can stack.

## Hard rules

- Never fabricate data the UI treats as factual — cite sources.
- Record `runMeta` (model, skills, tools) on agent-written artifacts.
- Use server/shared code for deterministic fields; you own qualitative fields.
- After **code** edits, run `skills/change-verification` → `npm run verify`.

## Change verification

```bash
npm run verify
```

Tiers: `docs/qa/VERIFICATION-TIERS.md`.
