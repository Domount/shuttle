---
name: research-task
description: Simple research workflow for hello-agent example — write a note JSON file.
---

# Research task

Load `skills/optimized-research/` first. Everything there applies (decompose → route fast/medium/deep → cite); this skill defines the hello-agent output.

## When to use

- `research-task` request is queued

## Steps

1. Read `memory/active/operating-principles.md`.
2. Pick a topic from the request payload or default to "Shuttle framework".
3. Write `data/notes/<timestamp>.json`:

```json
{
  "topic": "...",
  "summary": "...",
  "sources": [{ "title": "", "url": "" }],
  "runMeta": {
    "at": "ISO-8601",
    "model": "...",
    "skills": ["optimized-research", "research-task"],
    "tools": [],
    "depthChoices": {}
  }
}
```

4. Mark request `done` with a short `response` summary.
