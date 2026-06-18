# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-06-18

### Added

- `Router` export from `@domount/shuttle/server` for app route modules
- Showcase UI refresh (macOS-style light theme, Shuttle branding, unified `AppIcon` + favicon)
- Monorepo scripts: `build:app`, `dev:app`, `verify:app`, `sync:favicon`

### Fixed

- `useFetch` infinite API loop in the default web template
- Scaffolded apps failing to start when route files imported `express` directly
- `sync-create-shuttle-template` failing with `ENOTEMPTY` on macOS
- GitHub Pages docs workflow not triggering on `master` branch

### Changed

- Default template routes import `{ Router, asyncHandler }` from `@domount/shuttle/server`
- Scaffold API route template updated to match

## [0.1.1] - 2026-06-18

### Added

- Package READMEs for `@domount/shuttle` and `@domount/create-shuttle`
- npm metadata: `repository`, `homepage`, `bugs`, `license`, `keywords`
- MIT `LICENSE`
- VitePress documentation site at [domount.github.io/shuttle](https://domount.github.io/shuttle/)
- GitHub Actions workflow to deploy docs to GitHub Pages

## [0.1.0] - 2026-06-17

### Added

- Initial publish of `@domount/shuttle` and `@domount/create-shuttle`

[0.1.2]: https://github.com/Domount/shuttle/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Domount/shuttle/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Domount/shuttle/releases/tag/v0.1.0
