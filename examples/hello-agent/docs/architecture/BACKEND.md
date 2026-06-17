# Backend

```
Client → routes/ → services/ → store / providers
```

- Routes: thin HTTP mapping, `try/catch → next(err)`
- Services: business logic
- Providers: external APIs only
- Store: `@domount/shuttle/store` via `server/src/store.js`

Never import `web/` from server.
