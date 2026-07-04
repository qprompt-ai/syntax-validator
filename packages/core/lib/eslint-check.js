"use strict";

const fs = require("fs");
const path = require("path");
const { ESLint } = require("eslint");

const FLAT_CONFIG_NAMES = [
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.cjs",
  "eslint.config.ts"
];

// fallbackConfigFile is used only when the project being checked ships no
// ESLint config of its own, so validators stay usable out of the box.
async function runEslintCheck(file, projectRoot, { fallbackConfigFile } = {}) {
  const report = [];

  try {
    const projectHasConfig = FLAT_CONFIG_NAMES.some(name =>
      fs.existsSync(path.join(projectRoot, name))
    );

    const eslint = new ESLint({
      cwd: projectRoot,
      ...(!projectHasConfig && fallbackConfigFile
        ? { overrideConfigFile: fallbackConfigFile }
        : {})
    });

    const results = await eslint.lintFiles([file]);

    for (const result of results) {
      for (const message of result.messages) {
        report.push({
          ruleId: message.ruleId,
          severity: message.severity === 2 ? "error" : "warning",
          message: message.message,
          file: result.filePath,
          line: message.line,
          column: message.column
        });
      }
    }
  } catch (err) {
    report.push({ severity: "error", message: err.message });
  }

  return report;
}

module.exports = { runEslintCheck };
