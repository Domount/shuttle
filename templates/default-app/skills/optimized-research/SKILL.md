---
name: optimized-research
description: >-
  Research routing for Shuttle apps: decompose questions, assign fast/medium/deep
  depth, route to Parallel/Tavily MCP or better primary sources, cite every claim.
  Load before any domain skill that performs external research.
---

# Optimized Research

Project skill: `skills/optimized-research/`. **Do not** store or look for this under `~/.cursor/skills-cursor/` — that path is Cursor-managed and not durable.

Use **Cursor MCP only** — no CLI installs, no curl to MCP endpoints.

## Prerequisites

Confirm these MCP servers are enabled (names may vary per workspace):

| Server | Tools | Role |
|--------|-------|------|
| Parallel Search MCP | `web_search`, `web_fetch` | Fast lookup, fact-check, official pages |
| Tavily | `tavily_search`, `tavily_research`, `tavily_extract` | Medium search, deep synthesis |

Read tool schemas from the project's `mcps/` folder before calling.

**User override:** If the user asks to use only Parallel, only Tavily, or a specific tool/method, skip the routing below and follow their instruction.

**Beyond these two tools:** Any other research method — direct fetch of primary sources, public APIs, local `data/` files, other available MCPs — is allowed when it is clearly more valid, cheaper, or easier than the defaults. State the reasoning in one line when deviating.

## Workflow

### 1. Clarify scope

- What questions must be answered?
- Any local files or ground-truth data to reconcile against?
- **Output format:** If the user already specified (JSON schema, markdown report, website, etc.), use that. Otherwise **ask once** how they want results delivered before researching.

### 2. Decompose

Split the job into atomic sub-questions. For each, assign a depth:

| Depth | When | Tool |
|-------|------|------|
| **Fast** | Single fact, current number, "does X match Y?", one official stat | Parallel `web_search`; `web_fetch` if excerpts are thin and URL is known |
| **Medium** | A few related facts, light comparison, recent news | Parallel `web_search` (batch queries in one call) or Tavily `tavily_search` |
| **Deep** | Multi-domain synthesis, narrative report, strategies, broad explainers | Tavily `tavily_research` (`pro` for broad topics) |

Run independent legs in parallel where possible.

### 3. Execute

- Prefer **Tier 1 sources** when verifying facts: official agencies, primary documentation, authoritative data publishers.
- Cross-check numbers against user-supplied or parsed local data when present.
- Cite every factual claim with a URL from tool results.
- Do not invent statistics.

### 4. Synthesize

Merge sub-results into the user's requested output format. Note disagreements between sources or tools when they matter.

## Routing heuristics

**Parallel wins when:** speed matters, you need a specific official page/table, fact-checking a few figures, or fetching a known URL.

**Tavily wins when:** one prompt should produce a cohesive long-form answer, multi-angle comparison, or actionable narrative across domains.

**Default for mixed jobs:** Parallel for verification legs, Tavily for synthesis legs — don't run Tavily deep research for a question Parallel can answer in one search.

## What not to do

- Do not install CLIs or use bash wrappers when MCP tools are available.
- Do not use one deep research call for the entire job if most sub-questions are simple lookups.
- Do not assume output structure — ask if unspecified.

## Downstream skills

Domain-specific scope lives in your project's `skills/<name>/` files. **Load this skill first**; then the scoped skill for the task (e.g. `skills/research-task/`, `skills/contacts-research/`).

Record depth choices per leg in `runMeta` on agent-written artifacts.
