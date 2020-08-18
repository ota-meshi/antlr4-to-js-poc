const antlr4 = require("antlr4");
const {
  PostgreSQLLexer,
  // eslint-disable-next-line node/no-unpublished-require
} = require("../../dist-parser/antlr_psql/antlr4/PostgreSQLLexer");
const {
  PostgreSQLParser,
  // eslint-disable-next-line node/no-unpublished-require
} = require("../../dist-parser/antlr_psql/antlr4/PostgreSQLParser");
// eslint-disable-next-line node/no-unpublished-require
// const { PostgreSQLParserListener } = require('../../dist-parser/antlr_psql/antlr4/PostgreSQLParserListener')
module.exports = {
  parse,
};

/** @typedef {import('antlr4').AntlrRule} AntlrRule */
/** @typedef {import('antlr4').Token} Token */
/**
 * @typedef { AntlrRule & { tokens: Token } } ParseResult
 */
/**
 * Parse for SQL
 * @returns {ParseResult}
 */
function parse(input) {
  const chars = new antlr4.InputStream(input);
  const lexer = new PostgreSQLLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new PostgreSQLParser(tokens);
  parser.buildParseTrees = true;
  const result = parser.root();
  result.tokens = tokens.tokens;
  return result;
}
