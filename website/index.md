---
layout: home

hero:
  image:
    src: /shuttle-icon.png
    alt: Shuttle
  name: Shuttle
  text: Local agentic app framework
  tagline: Normal Node backend + smart agent backend + React web client
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/Domount/shuttle
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/@domount/shuttle

features:
  - title: Two backends
    details: Express serves CRUD and deterministic logic. Cursor agents handle research, qualitative fields, and skill-driven workflows.
  - title: JSON source of truth
    details: data/ on disk — never ES-imported. Server reads via @domount/shuttle/store; agents read and write files directly.
  - title: Skills & memory
    details: Ship optimized-research and change-verification skills. Domain skills compose on top. memory/active/ loads every session.
  - title: Verification gates
    details: Tier 0–3 via npm run verify. Import boundaries, lint, and tests run before agents mark work done.
  - title: Scaffolds
    details: Generate API routes, React features, and agent skills from the CLI or npm scripts.
  - title: Cursor runners
    details: Manual, cursor-cli, and cursor-sdk agent runners with a request queue in data/requests/.
---
