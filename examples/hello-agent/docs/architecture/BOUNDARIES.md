# Boundaries

Layered layout — features stay isolated; shared code has a single direction of dependency.

```
web/src/features/<page>/   ← pages
web/src/components/        ← reusable UI
web/src/lib/               ← helpers
web/src/api/               ← HTTP client

shared/                    ← tested logic (no React/Express)
server/src/                ← routes → services → store/providers
data/                      ← JSON (never imported as modules)
```

See the Shuttle framework docs for full rules.
