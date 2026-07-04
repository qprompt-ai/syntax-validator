# cypress-validator

Validates a single Cypress spec file with TypeScript's compiler and ESLint (`eslint-plugin-cypress` + `@typescript-eslint`), without requiring the target project to have Cypress or an ESLint config installed.

## Build

From the repo root (build context must be the root — the Dockerfile needs `packages/core`):

```sh
docker build -f packages/validators/cypress/Dockerfile -t cypress-validator .
```

## Run

Run from the repo root, mounting the sample fixture (or your own project directory):

```sh
docker run --rm \
  -v "$(pwd)/packages/validators/cypress/workspace:/workspace" \
  cypress-validator \
  --project /workspace \
  --file login.cy.ts
```

`--project` is the mounted directory containing the spec and (optionally) its own `tsconfig.json` / `eslint.config.js`. `--file` is resolved relative to `--project`.

## Fallbacks

- **TypeScript**: if the project's `tsconfig.json` has `"types": ["cypress"]`, Cypress's bundled type definitions resolve automatically even though the mounted project has no `node_modules`.
- **ESLint**: if the project has no `eslint.config.{js,mjs,cjs,ts}`, the bundled `eslint.config.cjs` in this package (typescript-eslint recommended + `eslint-plugin-cypress` recommended) is used instead.

A `workspace/` sample fixture is included for manual testing (`login.cy.ts` + `tsconfig.json`).
