# Brand assets

Canonical logos for Shuttle and Domount. **PNG only** — do not trace to SVG.

| File | Use |
|------|-----|
| `shuttle-icon.png` | Shuttle app icon, favicons, docs site, README |
| `domount-icon.png` | Domount org mark (README publisher line, GitHub org avatar) |

After editing `shuttle-icon.png`, sync derived assets:

```bash
npm run sync:favicon
```

This copies resized favicons into the default app template, hello-agent example, and docs site (`web/public/` and `website/public/`).
