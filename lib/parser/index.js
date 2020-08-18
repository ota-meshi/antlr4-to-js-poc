
const antlr4 = require('antlr4')
// eslint-disable-next-line node/no-unpublished-require
const { PostgreSQLLexer } = require('../../dist-parser/antlr_psql/antlr4/PostgreSQLLexer')
// eslint-disable-next-line node/no-unpublished-require
const { PostgreSQLParser } = require('../../dist-parser/antlr_psql/antlr4/PostgreSQLParser')
// eslint-disable-next-line node/no-unpublished-require
// const { PostgreSQLParserListener } = require('../../dist-parser/antlr_psql/antlr4/PostgreSQLParserListener')
module.exports = {
  parse
}

/**
 * Parse for SQL
 */
function parse (input) {
  const chars = new antlr4.InputStream(input)
  const lexer = new PostgreSQLLexer(chars)
  const tokens = new antlr4.CommonTokenStream(lexer)
  const parser = new PostgreSQLParser(tokens)
  parser.buildParseTrees = true
  return parser.root()
}
