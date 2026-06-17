---
name: research-task
description: Simple research workflow for hello-agent example — write a note JSON file.
---

# Research task

## When to use

- `research-task` request is queued

## Steps

1. Read `memory/active/operating-principles.md`.
2. Pick a topic from the request payload or default to "Loom framework".
3. Write `data/notes/<timestamp>.json`:

```json
{
  "topic": "...",
  "summary": "...",
  "runMeta": { "at": "ISO-8601", "model": "...", "skills": ["research-task"] }
}
```

4. Mark request `done` with a short `response` summary.
