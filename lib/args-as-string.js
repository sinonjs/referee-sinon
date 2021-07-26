"use strict";

/**
 * Returns a comma separated string
 *
 * @param  {arguments} args Arguments object from a function invocation
 * @returns {string}
 */
function argsAsString(args) {
  return Array.from(args)
    .map((v) => String(v))
    .join(", ");
}

module.exports = argsAsString;
