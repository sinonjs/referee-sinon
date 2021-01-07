"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
  input: "lib/referee-sinon.js",
  output: {
    inlineDynamicImports: true,
    file: "dist/referee-sinon.js",
    exports: "named",
    format: "umd",
    name: "refereeSinon"
  },
  plugins: [commonjs({ sourceMap: false })]
};
