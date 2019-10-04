"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
    entry: "lib/referee-sinon.js",
    format: "umd",
    moduleName: "refereeSinon",
    plugins: [commonjs({ sourceMap: false })]
};
