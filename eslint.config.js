"use strict";

const sinonConfig = require("@sinonjs/eslint-config");

module.exports = [
  {
    ignores: [
      "eslint.config.js",
      "coverage/**",
      "dist/**",
      "docs/**",
      "site/**",
    ],
  },
  ...sinonConfig,
];
