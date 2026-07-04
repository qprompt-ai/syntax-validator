#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const { Command } = require("commander");
const { runTypeScriptCheck, runEslintCheck, buildReport } = require("@syntax-validator/core");

async function main() {
  const start = Date.now();

  const cli = new Command();
  cli
    .requiredOption("--file <file>")
    .option("--project <project>", process.cwd());
  cli.parse();

  const options = cli.opts();
  const projectRoot = path.resolve(options.project);
  const file = path.resolve(projectRoot, options.file);

  if (!fs.existsSync(file)) {
    console.error(
      JSON.stringify({
        valid: false,
        error: `File not found: ${file}`
      })
    );
    process.exit(1);
  }

  // Cypress ships its own type definitions inside its own package rather than
  // under @types, and this validator bundles cypress as a dependency so that
  // projects being checked don't need to install it themselves. Resolving via
  // require.resolve (rather than assuming __dirname/node_modules) keeps this
  // correct whether or not npm workspace hoisting moved cypress elsewhere.
  const cypressNodeModules = path.dirname(
    path.dirname(require.resolve("cypress/package.json"))
  );

  const { configPath, report: tsReport } = runTypeScriptCheck(file, projectRoot, {
    extraTypeRoots: [
      path.join(cypressNodeModules, "@types"),
      cypressNodeModules
    ]
  });

  const eslintReport = await runEslintCheck(file, projectRoot, {
    fallbackConfigFile: path.resolve(__dirname, "eslint.config.cjs")
  });

  const output = buildReport({
    validator: "validate-cypress",
    version: "1.0.0",
    projectRoot,
    tsconfigPath: configPath,
    start,
    tsReport,
    eslintReport,
    extraCategories: { cypress: [], customRules: [] }
  });

  console.log(JSON.stringify(output, null, 2));
  process.exit(output.valid ? 0 : 1);
}

main();
