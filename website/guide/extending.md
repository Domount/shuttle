# Extending Shuttle

## Add a feature page

```bash
npm run scaffold:api -- contacts
npm run scaffold:feature -- contacts
```

## Add a domain skill

```bash
npm run scaffold:skill -- contacts-research
```

Update `AGENT.md` task matrix and `data/README.md` schemas.

## Swap the store

`@domount/shuttle/store` exposes `createStore()`. Implement the same interface against SQLite/Postgres and replace `server/src/store.js`.

## Publish (monorepo maintainers)

```bash
npm login
npm run release:dry
npm run release
```

Publishes `@domount/shuttle` and `@domount/create-shuttle`. Bump `version` in both packages before each release (keep in sync).

New apps from `npx @domount/create-shuttle` use published semver (`^0.1.1`). Monorepo dev uses `file:` when `packages/shuttle` exists locally.
