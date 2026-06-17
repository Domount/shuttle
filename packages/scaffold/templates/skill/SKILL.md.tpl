---
name: {{skillKebab}}
description: Domain skill for {{skillTitle}} workflows. Update AGENT.md task matrix to reference this skill.
---

# {{skillTitle}}

## When to use

- User queues a `{{skillKebab}}` request type
- AGENT.md task matrix routes here

## Steps

1. Read `memory/active/operating-principles.md` and relevant data contracts in `data/README.md`.
2. Load inputs from `data/` (never import JSON as ES modules).
3. Perform research / synthesis per project rules.
4. Write outputs to `data/` with `runMeta` on artifacts.
5. Mark the request `done` in `data/requests/`.

## Outputs

Document required files here after you define the workflow.
