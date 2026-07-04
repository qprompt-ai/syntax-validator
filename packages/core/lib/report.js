"use strict";

function buildReport({
  validator,
  version,
  projectRoot,
  tsconfigPath,
  start,
  tsReport,
  eslintReport,
  extraCategories = {}
}) {
  const eslintErrors = eslintReport.filter(e => e.severity === "error").length;
  const eslintWarnings = eslintReport.filter(e => e.severity === "warning").length;

  return {
    validator,
    version,
    project: {
      root: projectRoot,
      tsconfig: tsconfigPath ?? null
    },
    executionTimeMs: Date.now() - start,
    valid: tsReport.length === 0 && eslintErrors === 0,
    summary: {
      typescriptErrors: tsReport.length,
      eslintErrors,
      eslintWarnings
    },
    categories: {
      typescript: tsReport,
      eslint: eslintReport,
      prettier: [],
      ...extraCategories
    }
  };
}

module.exports = { buildReport };
