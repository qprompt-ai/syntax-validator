"use strict";

module.exports = {
  ...require("./lib/typescript-check"),
  ...require("./lib/eslint-check"),
  ...require("./lib/report"),
  reportSchema: require("./schema/validation-report.schema.json")
};
