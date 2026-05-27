# AGENTS.md — AI Harness Guidelines

> **Quick ref:** Yarn 1.x · Node ≥22.11 · `yarn build` (two-stage) · `tsc --noEmit` · `yarn test` · Browser runtime only · `@/` imports · Compile-time macros from `.env` · Draft PRs to `master`

## Project Overview

- **Package**: SDEBot (no npm publish — delivered as browser console script)
- **Purpose**: Automates content publishing on SEDUC/RO Diário Eletrônico website. Output = single JS bundle pasted into browser console.
- **Runtime**: Not a Node.js app at runtime. Built script runs in browser. Node.js = build pipeline + tests only.
- **Module system**: ES2022 modules in source (`tsconfig.json`), CommonJS in build output (`tsconfig.build.json`)
- **Package manager**: Yarn 1.x (classic) — **never `npm install`**, always `yarn`

## Build & Development Commands

| Command | Purpose |
|---------|---------|
| `yarn install` | Install deps + auto-copy `.env.example` → `.env` if missing (postinstall) |
| `yarn build` | Two-stage: `prebuild` (tsc → tsc-alias) then webpack → `dist/.webpack/script.js` |
| `yarn build:clean` | `rimraf dist` + full build |
| `yarn test` | Jest (ts-jest preset, single run) |
| `yarn test:coverage` | Jest with coverage |
| `yarn test:inspect` | Jest with `--inspect` |
| `yarn test --testPathPattern <path>` | Run tests matching file path (e.g. `yarn test --testPathPattern BaseError`) |
| `yarn test --testNamePattern <pattern>` | Run tests matching name (e.g. `yarn test --testNamePattern "should create"`) |
| `yarn circular-dependencies` | Check circular imports (madge) |
| `tsc --noEmit` | Typecheck (no dedicated script — run manually) |

No `lint` or `typecheck` script. ESLint config exists but not wired. Formatting via Prettier (`.prettierrc.json`) + EditorConfig (`.editorconfig`).

## Requirements

- **Node.js >=22.11.0** (package.json `engines` = source of truth — README says 18+ but outdated)
- **Yarn 1.x** (classic)
- `.env` required (gitignored). Auto-generated from `.env.example` on first `yarn install`.
- Docker (optional): `./run <cmd>` wraps any command in `node:23-slim` container. Windows: `.\run.ps1 <cmd>`.

## Architecture

| Directory | Purpose |
|-----------|---------|
| `src/main.ts` | Entrypoint — dispatches `run()` or `runWithQueue()` based on `mode` env var |
| `src/diario-seduc/` | Browser-side automation: fetch turmas/conteudos, post content, queue, schemas, types |
| `src/build/` | Build-time Node.js code (env validation, memory loading, JSONC parsing). Imported by webpack at build time — **not** shipped to browser |
| `src/build/node/` | Node.js-specific build utilities (`handleMemData`, `resolvePath`) — build only, not in browser bundle |
| `src/common/` | Shared: `Queue`, `GroupFactory`, `BaseError`, `debug`, `sleep`, schemas, validators |
| `src/@types/` | Global type declarations (compile-time macros, `GetTypeFromSchema`, `Prettify`) |
| `data/` | User memory files (JSONC/JSON/CJS) — excluded from TS compilation, loaded at build time via webpack DefinePlugin |
| `dist/` | Build output — `dist/.webpack/script.js` = final deliverable |

### Compile-time macros

Webpack `DefinePlugin` injects as **global constants** from `.env` at build time: `defaultMemory`, `mode`, `INTERVAL`, `CONSUMER_SLEEP_INTERVAL`, `RATE_LIMIT`, `CONCURRENCY`. **NOT** runtime variables — baked into bundle. Declared in `src/@types/global.d.ts`.

### Two tsconfigs

| File | Use | Module format | Notes |
|------|-----|---------------|-------|
| `tsconfig.json` | Editor, typecheck (`tsc --noEmit`) | ES2022 | Source of truth for IDE |
| `tsconfig.build.json` | Build (`yarn build` prebuild step) | CommonJS | Generates declarations, source maps, `dist/` output |

### Path alias

`@/*` → `src/*` (+ root `/*` and `dist/*` in `tsconfig.json`). Resolved by `tsc-alias`. All local imports use `@/` prefix.

### Schema validation

`@srhenry/type-utils` (`Experimental.validate`) validates env vars (`EnvironmentValidator`) and memory files (`MemoryFileValidator`, `GlobalMacroValidator`). Schemas in `src/*/schemas/`.

### Memory data format

`MEMORY_DATA_PATHS` = JSON array string in `.env` (e.g. `["data/memory-example.jsonc"]`). Values: JSON, JSONC, or CommonJS files. Conteudos values: string arrays or URLs (latter fetches content from turma page).

## Prohibitions

- NEVER add `npm install` — Yarn 1.x exclusively
- NEVER run built script in Node.js — browser console only
- NEVER treat `defaultMemory`, `mode`, `INTERVAL`, etc. as runtime config — compile-time macros baked by webpack
- NEVER add files to `src/test/` — excluded from test discovery; use `__tests__/` dirs alongside source
- NEVER import from `src/build/` in `src/diario-seduc/` — build code runs at build time only, not in browser bundle
- NEVER use `.js`/`.mts`/`.cts` extensions in imports — source uses ESM-style paths resolved by tsc-alias
- NEVER insert a task into `TASKS.md` without evaluating it against opt-in metadata criteria — if the task fits even one, the agent **must** populate the corresponding field(s). A task with zero opt-in fields is fine; a task that should have had them is a violation
- NEVER skip `tsc --noEmit` after code changes — typecheck is mandatory, not optional, regardless of whether `yarn test` passes
- NEVER commit with placeholder author identity (`Test`, `test@test.com`, etc.) — stop and ask the user for correct identity before proceeding
- NEVER silently overwrite established AGENTS.md guidelines — always propose first and get confirmation, even when not in doubt

## Gotchas

- ALWAYS `yarn build` (not webpack alone) — webpack imports from `dist/`, TS must compile first or build fails
- NEVER polyfill `fetch`, `DOMParser`, `Response` etc. or run automation in Node — browser-console script with no Node entry points
- ALWAYS rebuild after changing `.env` — compile-time macros injected by webpack `DefinePlugin` at build time, not read at runtime
- `exactOptionalPropertyTypes: true` — optional props don't implicitly add `undefined`; stricter behavior surprises
- `tsconfig.build.json` excludes `data/` and `assets/` — memory data files not part of TS compilation
- `./run <cmd>` = Docker wrapper (`node:23-slim`), not project runner script

## External References

### `@srhenry/type-utils`

Only runtime dependency. Provides `Experimental.validate` for schema validation, type guards, schema builders.

- Upstream AGENTS.md with API details + known issues: https://github.com/SrHenry/type-utils/raw/refs/heads/developer/AGENTS.md
- Read when modifying schemas, validators, or working with `Experimental.validate`

### Upstream issue reporting

Genuine problems in `@srhenry/type-utils` (bugs, missing types, API gaps, behavioral quirks):

1. Document — minimal reproduction, expected vs actual, affected version
2. File issue via `gh issue create --repo SrHenry/type-utils` with details
3. Reference filed issue number in consuming code's comments or commit message

Do **not** file issues for usage misunderstandings or features working as designed — only genuine bugs, type errors, or missing functionality that blocks this project.

## Tests

- Test files: `.spec.ts` in `__tests__/` dirs alongside source (e.g. `src/common/errors/__tests__/BaseError.spec.ts`)
- `src/test/` intentionally empty, excluded from discovery (`testPathIgnorePatterns` in `jest.config.js`)
- Custom matcher: `expect(x).toMatchStructure(y)` — normalizes complex objects (functions, dates, maps, sets, circular refs). Defined in `src/jest.setup.ts`
- Minimal test suite currently — only `BaseError` has tests

### Definition of Done

Before declaring task complete, verify:

- `npx tsc --noEmit` passes with zero errors
- `yarn test` passes (or no test regressions introduced)
- No new circular dependencies (`yarn circular-dependencies`)
- Changed files follow `@/` import convention
- No secrets or personal info in committed code

## Code Conventions

### Import style

- Path alias: `@/*` → `src/*`. All local imports use this.
- CommonJS in build output — no ESM import extensions in source files

### Commit Style

Conventional Commits with emoji: `type: :emoji: description`

Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `build`
Emoji: `:sparkles:` feat, `:bug:`/`:ambulance:` fix, `:recycle:` refactor, `:truck:` rename, `:arrow_up:` deps, `:lock:` security, `:construction_worker:` ci, `:memo:` docs, `:building_construction:` infra, `:test_tube:` tests, `:card_file_box:` data, `:heavy_plus_sign:` deps add

### Commit Authoring

Before any commit, AI harness **must** clarify author identity:

- **Default author**: Local then global git config of root worktree (`git config user.name` / `git.config user.email` from main repo checkout, not ephemeral worktree) — confirm with user before first commit in session
- **Verification**: Before first commit, check `user.name` / `user.email` — if placeholder values (e.g. `Test`, `test@test.com`), stop and ask
- **Override**: If user explicitly requests different author (co-author, bot identity, different email), use that — never assume alternate identity without explicit direction
- **GPG signing**: `commit.gpgsign=true`. Commits should be GPG-signed (`-S` / `--gpg-sign`) with key matching author's email

### Branch Naming

- `feat/<topic>` — New features
- `refactor/<topic>` — Refactors
- `fix/<topic>` — Bug fixes
- `hotfix/<topic>` — Urgent fixes

### Branch Roles

- `master` — Default branch. All PRs target this.

## Session Behavior

### Classify every request before acting

- **CODE-PRODUCING** (features, fixes, refactors, deprecations, breaking changes) → Strict — follow PR Workflow below
- **EXPLORATORY** (questions, debugging, codebase navigation, code review) → Loose — respond conversationally, use search/read tools freely

### CODE-PRODUCING: scope gate

Do **NOT** create branches, worktrees, or write code until all confirmed:

1. **Worktree required** — all code-producing work in ephemeral worktree (`/tmp/<repo-name>-<topic>`), **never** in main repo checkout. User may explicitly opt out ("work in main checkout" / "no worktree") — but never assume; always use worktree unless told otherwise
2. **Base branch** — `master` for all work (no integration branch in this repo). Different base → analyze against industry standards and question before proceeding
3. **Related issues** — GitHub issue numbers, URLs, or external references (or explicitly "none")
4. **Scope delimited** — what's included, excluded, expected behavior for edge cases
5. **User confirms** — restate understanding and get explicit go-ahead before proceeding

Vague or ambiguous request → ask targeted questions. Better to over-clarify than assume. Never start implementation on unclear intent.

### Self-updating knowledge

AI harness **must** persist newly learned project knowledge into this file as discovered during sessions.

#### Auto-persist (no confirmation needed)

Auto-persist only when **all** of the following are true:

1. **Verifiable from source** — the fact can be confirmed by reading code, config, or dependency behavior (not subjective opinion)
2. **Fills a gap** — no existing rule, gotcha, or entry already covers it
3. **No behavior change** — the fact doesn't alter how the agent should act (that's propose-first territory)

If any criterion is uncertain → propose first instead.

Section routing for auto-persisted facts:

| Discovery type | Target section |
|----------------|---------------|
| Build/runtime gotcha not covered | Gotchas |
| Directory purpose not documented | Architecture table |
| Missing Prohibition (behavior that must never happen) | Prohibitions |
| New command or script not in table | Build & Development Commands |
| Dependency behavioral quirk | Gotchas or External References |
| Test convention or matcher | Tests |
| Import/resolution pattern | Code Conventions → Import style |

Before persisting, **scan existing content for overlap**. If a similar entry exists, amend it rather than adding a parallel one. Dedup keeps the file tight.

#### Propose first (require confirmation)

For anything that contradicts/overrides established conventions, changes architecture, adds controversial opinions, or reshapes project status quo.

Proposals that aren't confirmed before the session ends must be persisted to `TASKS.md` as a blocked task so they survive across sessions:

```markdown
- [ ] AGENTS.md: <proposed change summary>
  - **Blocked**: needs-user-confirmation
  - **Details**: <what to add/change and where>
  - **Files**: AGENTS.md
```

Next session picks up the task and re-asks.

#### Retract mechanism

If an auto-persisted fact is later discovered to be wrong, the agent must **flag, not silently remove**. Strike through the incorrect entry and add the correction on the next line:

```markdown
- ~~ALWAYS use X for Y — reason given~~ — retracted: <why it was wrong>
- ALWAYS use Z for Y — <correct reason>
```

This makes knowledge evolution auditable in git history.

### EXPLORATORY: conversational mode

- No branches, worktrees, or PRs
- Use search, read, analysis tools freely
- If exploration leads to code change → re-classify as CODE-PRODUCING and start scope gate from top

## Task Management

- `TASKS.md` at repo root — prioritized task queue (P0–P3 headings, checkbox tasks)
- Read `TASKS.md` for available work before asking user what to do next
- Claim tasks by appending `(@agent-name)` to task line before starting work
- Remove completed tasks from file — history lives in git log, not in queue

### Metadata fields

Two tiers — **core** (always available, use when relevant) and **opt-in** (agent must judge fitness and populate when warranted).

**Core** — lightweight, for any task:

- **ID**: Stable identifier for `**Blocked by**:` references (kebab-case)
- **Details**: Context agent can't discover on its own
- **Files**: Starting points for agent to read
- **Acceptance**: Testable criterion for "done"
- **Blocked by**: Comma-separated task IDs — unblocked when all referenced IDs no longer exist in file
- **Blocked**: Free-form reason for external blocks (needs approval, missing credentials, etc.) — any non-empty value marks task as blocked

**Opt-in** — agent evaluates whether a new task warrants these fields before inserting it. If the task fits the criteria below, the agent **must** populate the relevant opt-in fields — either from user-provided info or by inferring from context. If inferring, the agent is accountable: it must be able to justify each value, and should ask the user if uncertain rather than guess.

- **Plan**: Checklist before coding on multi-file or architectural tasks. **Add when**: task touches 3+ files or involves non-obvious implementation order
- **Parent**: Original task ID when splitting a large task into smaller top-level tasks. **Add when**: task was decomposed from another task that still exists in the file
- **Research** + **Last-enriched**: Read-only research notes + `YYYY-MM-DD` stamp, accumulated while task is blocked. **Add when**: task is blocked and agent has gathered context that would otherwise be lost between sessions. Enrichment never touches `**Blocked**:` or `**Blocked by**:` — only metadata
- **Estimate**: Free-form duration (`2-3d`, `30min`). **Add when**: task is non-trivial enough that context-budget planning matters — helps agent decide if task fits remaining session
- **Verification**: Runnable procedure confirming done (distinct from **Acceptance** = the *criterion*, **Verification** = the *how*). **Add when**: "done" can't be verified by a single `yarn test` — e.g. manual steps, specific command sequences, multi-step validation
- **Risk** + **Mitigation**: What could go wrong + how to handle it. **Add when**: task involves migration, breaking changes, dependency swaps, or touching stable/production-critical code paths
- **Hypothesis** + **Success** + **Pivot** + **Measurement** + **Anchor**: Rule-#9 pre-registration block. Declares what observable a change expects to move *before* coding. **Hypothesis** = predicted effect, **Success** = keep threshold, **Pivot** = abandon threshold, **Measurement** = exact runnable command (no English), **Anchor** = literature/design-doc citation justifying threshold. **Add when**: task is a performance change, architectural refactor, or any non-trivial change where "did it help?" is genuinely ambiguous — prevents post-hoc fishing for flattering metrics
- **Touches**: Expected write-set (files task will modify). Distinct from **Files** (which may include read-only refs). **Add when**: multiple tasks or agents may work in parallel on overlapping files — enables orchestrator to serialize conflicting tasks
- **Surfaced-by**: Provenance — which audit, lint, observer, or sweep produced this task. **Add when**: task originates from an automated sweep or audit loop rather than a human request
- **Milestone**: Roadmap grouping (`M1.1`, `Q3-2026`, `v0.2.0`, etc.). **Add when**: project has phased roadmap and tasks should be filterable by milestone

### Sub-tasks

Nested checkboxes under parent. Claiming agent owns all sub-tasks. Remove entire block when done. Sub-tasks for sequential steps owned by one agent; promote to separate top-level tasks with `**Blocked by**:` when steps can be parallelized or span multiple sessions.

### Writing good tasks

- One session, one task — if takes more than a sentence to describe, might be two tasks
- Include file paths — agents explore faster when they know where to look
- Define "done" — **Acceptance** field turns vague ask into testable outcome
- Use IDs for dependencies — if task B depends on A, give A an **ID** and add `**Blocked by**: task-a` to B
- When adding a task, scan the opt-in criteria — if the task fits even one, populate the corresponding field(s). A task with zero opt-in fields is fine; a task that should have had them is a missed opportunity

## PR Workflow with Git Worktrees

Standard workflow for AI harness sessions producing pull requests.

### 1. Gather Context

**Blocking gate** — do not proceed to step 2 until all resolved:

- **Base branch**: Always `master`. Different base → analyze against industry standards, question before proceeding.
- **Related issues**: Ask for GitHub issue numbers, URLs, or external references. Fetch with `gh issue view <number>` or `gh issue view <url>`.
- **Scope clarification**: Confirm what PR should accomplish. Vague request → ask targeted questions before starting.

### 2. Create Ephemeral Worktree + Branch

**Always fetch latest remote state before branching.** Run from main repo checkout:

```sh
git fetch origin master
```

Then create worktree + branch together — worktree stays alive for entire PR lifecycle:

```sh
git worktree add /tmp/leovincey-<topic> -b feat/<topic> origin/master
```

Skipping `git fetch` only acceptable when user explicitly confirms local ref is up to date. Work in worktree (`/tmp/` prefix — ephemeral, not inside main repo checkout). **First step after creating worktree: `yarn install`** to set up deps and trigger postinstall (copies `.env.example` → `.env` if missing). No code or builds until `yarn install` completes.

### 3. Implement

- Make changes in worktree directory
- Run `tsc --noEmit` and `yarn test` after each logical change step — not just "frequently"
- Commit using Conventional Commits with emoji format

### 4. Push & Create Draft PR

All non-urgent work must go through PR before merging. **Create as draft by default** — signals WIP, prevents accidental merges.

```sh
git push -u origin feat/<topic>
gh pr create --draft --base master --title "type: :emoji: description" --body "..."
```

`--draft=false` (or omit `--draft`) only when user explicitly requests ready-for-review PR, or change is trivially complete at push time. `hotfix/<topic>` that skip PR phase = only exception, but only when explicitly requested.

### 5. Iterate

- Keep worktree alive for follow-up commits (rebase, conflict resolution, review feedback)
- After force-pushing rebase: `git push --force-with-lease origin feat/<topic>`
- After resolving rebase conflicts: `git add <resolved-files> && GIT_EDITOR=true git rebase --continue`

### 6. Post-Merge Cleanup

Once PR merged, clean up everything:

```sh
# From main repo checkout (NOT the worktree):
git worktree remove /tmp/leovincey-<topic>
git fetch --prune
git branch -d feat/<topic>
git push origin --delete feat/<topic>
```

Restore main repo to original branch if needed.
