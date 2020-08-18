// @ts-check

const { parse: parseSQL } = require("../parser");

/** @typedef {import('prettier').AST} AST */
/** @typedef {import('prettier').Parser} Parser */
/** @typedef {import('prettier').ParserOptions} ParserOptions */
/** @typedef { {[parserName: string]: Parser} } Parsers */

/** @type {Parser} */
const parser = {
  parse,
  locStart(node) {
    if (node.symbol) {
      // TerminalNode
      return node.symbol.start;
    }
    // ParserRuleContext
    return node.start.start;
  },
  locEnd(node) {
    if (node.symbol) {
      // TerminalNode
      return node.symbol.stop;
    }
    // ParserRuleContext
    return node.stop.stop;
  },
  astFormat: "antlr-sql-ast",
};

module.exports = parser;

/**
 * Parse for Prettier
 * @param {string} text
 * @param {Parsers} parsers
 * @param {ParserOptions} options
 * @returns {AST}
 */
function parse(text, parsers, options) {
  return parseSQL(text);
}
