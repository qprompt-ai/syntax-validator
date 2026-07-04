"use strict";

const tsPlugin = require("@typescript-eslint/eslint-plugin");
const cypressPlugin = require("eslint-plugin-cypress");

module.exports = [
  ...tsPlugin.configs["flat/recommended"],
  cypressPlugin.configs.recommended
];
