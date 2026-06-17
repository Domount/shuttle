# Extending Loom

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

`@loom/store` exposes `createStore()`. Implement the same interface against SQLite/Postgres and replace `server/src/store.js`.

## Publish packages

Today apps use `file:{{loomRoot}}/packages/*` from `create-loom-app`. To publish, replace with npm versions `@loom/store@0.1.0`, etc.
