# syntax-validator

A monorepo of Dockerized syntax/lint validators for test-automation frameworks. Each validator takes a spec file, runs it through TypeScript's compiler and ESLint using rules for its framework, and reports back structured JSON (errors, warnings, categories) — designed to be called from CI, editors, or other tooling without needing the framework installed locally.

## Structure

```
packages/
  core/                    shared TypeScript-check + ESLint-check + JSON report logic
  validators/
    cypress/                Cypress spec validator (supported)
    playwright/              (planned)
    jest/                    (planned)
```

Each validator under `packages/validators/*` is a self-contained npm package with its own `Dockerfile`, bundled framework dependency (e.g. `cypress`), and fallback ESLint config — so it works out of the box even against a project that has no `node_modules` or lint config of its own.

## Supported validators

| Framework | Status | Docs |
|---|---|---|
| Cypress | supported | [packages/validators/cypress](packages/validators/cypress/README.md) |
| Playwright | planned | — |
| Jest | planned | — |

## Adding a new validator

1. `packages/validators/<name>/` with its own `package.json` (depending on `@syntax-validator/core`), `bin/validate-<name>`, CLI entry point, and `Dockerfile`.
2. Reuse `@syntax-validator/core`'s `runTypeScriptCheck`, `runEslintCheck`, and `buildReport` — only the framework-specific bits (bundled type roots, fallback ESLint config/rules, extra report categories) belong in the validator package.
3. Build with `docker build -f packages/validators/<name>/Dockerfile -t <name>-validator .` from the repo root (build context must be the root so the Dockerfile can reach `packages/core`).
