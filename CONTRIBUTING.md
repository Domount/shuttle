# Contributing to Shuttle

Thank you for your interest in contributing. Shuttle is an open-source local
agentic app framework — issues, docs improvements, and pull requests are welcome.

## Ways to contribute

- **Bug reports** — use the [bug report template](https://github.com/Domount/shuttle/issues/new?template=bug_report.yml)
- **Feature ideas** — use the [feature request template](https://github.com/Domount/shuttle/issues/new?template=feature_request.yml)
- **Documentation** — edit `docs/` or `website/` and open a PR
- **Code** — fix bugs, improve templates, or extend `@domount/shuttle` packages

## Development setup

```bash
git clone git@github.com:Domount/shuttle.git
cd shuttle
npm install
npm test
```

Build the showcase app locally:

```bash
npm run build:app
npm run dev:app
```

Docs site:

```bash
npm run docs:dev
```

## Project layout

| Path | Purpose |
|------|---------|
| `packages/shuttle/` | Core framework (`@domount/shuttle`) |
| `cli/create-shuttle/` | Scaffold CLI (`@domount/create-shuttle`) |
| `templates/default-app/` | App template source |
| `website/` | VitePress docs site |
| `examples/hello-agent/` | Reference app |

After editing `templates/default-app/`, sync the CLI bundle:

```bash
npm run sync:template
```

## Pull requests

1. Fork the repo and create a branch from `master`
2. Make focused changes — one concern per PR when possible
3. Run `npm test` before opening the PR
4. For template or web changes, verify with `npm run build:app` if relevant
5. Fill out the PR template

## Releases

Maintainers only. Bump `version` in both `packages/shuttle/package.json` and
`cli/create-shuttle/package.json` (keep in sync), update `CHANGELOG.md`, then:

```bash
npm run release:dry
npm run release
```

## Code of conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating,
you agree to uphold it.
