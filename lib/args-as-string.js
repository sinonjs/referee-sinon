"use strict";

var inspect = require("util").inspect;

/**
 * Returns a comma separated string
 *
 * @param  {arguments} args Arguments object from a function invocation
 * @returns {string}
 */
function argsAsString(args) {
  return Array.from(args)
    .map((v) => {
      try {
        return String(v);
      } catch {
        return inspect(v);
      }
    })
    .join(", ");
}

module.exports = argsAsString;
