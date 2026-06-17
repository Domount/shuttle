# Import paths

| Layer | Alias | Example |
|-------|-------|---------|
| Web | `@web/...` | `import { api } from "@web/api/client"` |
| Web → shared | `@shared/...` | `import { greet } from "@shared/example.js"` |
| Server | `#server/...` | `import { store } from "#server/store.js"` |
| Server → shared | `#shared/...` | `import { greet } from "#shared/example.js"` |
