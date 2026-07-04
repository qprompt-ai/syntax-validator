"use strict";

const path = require("path");
const ts = require("typescript");

function mapTsError(code) {
  switch (code) {
    case 2304:
      return "UndefinedVariable";
    case 2339:
      return "PropertyDoesNotExist";
    case 2551:
      return "UnknownCommand";
    case 1005:
      return "SyntaxError";
    case 1128:
      return "UnexpectedToken";
    default:
      return "TypeScriptError";
  }
}

// extraTypeRoots lets a validator point at type packages it bundles for its
// framework (e.g. cypress) so they resolve even when the project being
// checked has no node_modules of its own.
function runTypeScriptCheck(file, projectRoot, { extraTypeRoots = [] } = {}) {
  const configPath = ts.findConfigFile(
    projectRoot,
    ts.sys.fileExists,
    "tsconfig.json"
  );

  let compilerOptions = { noEmit: true };

  if (configPath) {
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      path.dirname(configPath)
    );
    compilerOptions = parsed.options;
    compilerOptions.noEmit = true;
  }

  if (extraTypeRoots.length > 0) {
    compilerOptions.typeRoots = [
      ...(compilerOptions.typeRoots ?? [path.join(projectRoot, "node_modules/@types")]),
      ...extraTypeRoots
    ];
  }

  const program = ts.createProgram([file], compilerOptions);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const report = diagnostics.map(d => {
    const pos = d.file
      ? d.file.getLineAndCharacterOfPosition(d.start)
      : null;

    return {
      category: ts.DiagnosticCategory[d.category],
      code: `TS${d.code}`,
      errorType: mapTsError(d.code),
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
      file: d.file?.fileName,
      line: pos ? pos.line + 1 : undefined,
      column: pos ? pos.character + 1 : undefined
    };
  });

  return { configPath, report };
}

module.exports = { runTypeScriptCheck, mapTsError };
