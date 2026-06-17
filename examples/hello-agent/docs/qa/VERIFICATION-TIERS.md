# Verification tiers

```bash
npm run verify
npm run verify:all
```

| Tier | Automated | Agent review |
|------|-----------|----------------|
| 0 | None | None |
| 1 | boundaries + lint | None |
| 2 | boundaries + lint + scoped tests + web build | Bugbot |
| 3 | boundaries + lint + all tests + web build | Bugbot + Security |

Configured in `shuttle.config.json` → `verify.scopedTests` and `verify.corePaths`.
