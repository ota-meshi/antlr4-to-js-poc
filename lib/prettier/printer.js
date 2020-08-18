// @ts-check
const antlr4 = require("antlr4");
const {
  PostgreSQLParser,
  // eslint-disable-next-line node/no-unpublished-require
} = require("../../dist-parser/antlr_psql/antlr4/PostgreSQLParser");
const {
  PostgreSQLLexer,
  // eslint-disable-next-line node/no-unpublished-require
} = require("../../dist-parser/antlr_psql/antlr4/PostgreSQLLexer");
const {
  // see https://github.com/prettier/prettier/blob/master/commands.md
  builders: {
    concat,
    // join,
    line,
    hardline,
    // softline,
    // group,
    // fill,
    indent,
    // dedent,
    // ifBreak,
    // breakParent,
  },
  // utils: { removeLines },
} = require("prettier").doc;

/** @typedef {import('antlr4').AntlrRule} AntlrRule */
/** @typedef {import('antlr4/tree/Tree').TerminalNode} TerminalNode */
/** @typedef {import('antlr4').Token} Token */
/** @typedef {import('prettier').AST} AST */
/** @typedef {import('prettier').Printer} Printer */
/** @typedef {import('prettier').FastPath} FastPath */
/** @typedef {import('prettier').ParserOptions} ParserOptions */
/** @typedef {import('prettier').Doc} Doc */
/** @typedef {AntlrRule | TerminalNode} ASTNode */

/** @type {Printer} */
const printer = {
  print: genericPrint,
};

module.exports = printer;

/**
 * @callback Print
 * @param {FastPath} path
 * @param {ParserOptions} options
 * @param { (path: FastPath) => Doc } print
 * @returns {Doc}
 */

/**
 * Print
 * @param {FastPath} path
 * @param {ParserOptions} options
 * @param { (path: FastPath) => Doc } print
 * @returns {Doc}
 */
function genericPrint(path, options, print) {
  /** @type {ASTNode} */
  const node = path.getValue();
  if (isTerminalNode(node)) {
    if (node.symbol.type === antlr4.Token.EOF) {
      return "";
    }
    return node.symbol.text;
  }
  const { ruleIndex } = node;
  const nodePrinter = nodePrinters[ruleIndex];
  if (nodePrinter) {
    return nodePrinter(path, options, print);
  }
  // Error
  const ruleName = Object.keys(PostgreSQLParser).find(
    (key) => key.startsWith("RULE_") && PostgreSQLParser[key] === ruleIndex
  );
  if (ruleName) {
    throw new Error(`unsupported node: ruleIndex=${ruleIndex}
Add \`[PostgreSQLParser.${ruleName}](path, options, print) {}\` to nodePrinters`);
  }
  throw new Error(`unsupported node: ruleIndex=${ruleIndex}`);
}

/**
 * Checks if the given node is TerminalNode.
 * @param {ASTNode} node
 * @returns {node is TerminalNode}
 */
function isTerminalNode(node) {
  return Boolean(/** @type {TerminalNode} */ (node).symbol);
}

/** @type { {[key: number]: Print} } */
const nodePrinters = {
  [PostgreSQLParser.RULE_root](path, options, print) {
    /** @type {AntlrRule} */
    const rootNode = path.getValue();
    return concat([
      concat(
        path.map((child, index) => {
          const doc = print(child);
          if (index === 0) {
            // has not next
            return doc;
          }
          /** @type {ASTNode} */
          const prevNode = rootNode.getChild(index - 1);
          if (isTerminalNode(prevNode)) {
            if (prevNode.symbol.type === PostgreSQLLexer.SEMI) {
              /** @type {AntlrRule} */
              const stmtNode = child.getValue();
              if (!stmtNode.getChildCount()) {
                // empty statement
                return doc;
              }
              return concat([hardline, hardline, doc]);
            }
          }
          return doc;
        }, "children")
      ),
      line, // EOF newline
    ]);
  },
  [PostgreSQLParser.RULE_stmt](path, options, print) {
    /** @type {AntlrRule} */
    const stmtNode = path.getValue();
    if (!stmtNode.getChildCount()) {
      // empty statement
      return "";
    }
    return concat(path.map(print, "children"));
  },
  [PostgreSQLParser.RULE_select_stmt](path, options, print) {
    return concat(path.map(print, "children"));
  },
  [PostgreSQLParser.RULE_selector_clause](path, options, print) {
    // SELECT FOO, BAR
    //        ^^^^^^^^
    return indent(concat([line, concat(path.map(print, "children"))]));
  },
  [PostgreSQLParser.RULE_column_list](path, options, print) {
    // SELECT FOO , BAR
    //        ^^^|^|^^^
    /** @type {ASTNode} */
    const listNode = path.getValue();
    return concat(
      path.map((child, index) => {
        const doc = print(child);

        if (index > 0) {
          const prevNode = listNode.getChild(index - 1);
          if (isTerminalNode(prevNode)) {
            if (prevNode.symbol.type === PostgreSQLLexer.COMMA) {
              return concat([line, doc]);
            }
          }
        }
        return doc;
      }, "children")
    );
  },
  [PostgreSQLParser.RULE_from_clause](path, options, print) {
    // SELECT * FROM A , B
    //          ^^^^|^|^|^
    /** @type {ASTNode} */
    const clauseNode = path.getValue();
    return concat([
      line,
      concat(
        path.map((child, index) => {
          const doc = print(child);
          if (index === 0) {
            // FROM
            return doc;
          }
          if (index === 1) {
            return indent(concat([line, doc]));
          }

          const prevNode = clauseNode.getChild(index - 1);
          if (isTerminalNode(prevNode)) {
            if (prevNode.symbol.type === PostgreSQLLexer.COMMA) {
              return indent(concat([line, doc]));
            }
          }
          return doc;
        }, "children")
      ),
    ]);
  },
  [PostgreSQLParser.RULE_from_item](path, options, print) {
    return concat(path.map(print, "children"));
  },
  [PostgreSQLParser.RULE_table_name_](path, options, print) {
    return concat(path.map(print, "children"));
  },
  [PostgreSQLParser.RULE_identifier](path, options, print) {
    return concat(path.map(print, "children"));
  },
  [PostgreSQLParser.RULE_expr](path, options, print) {
    return concat(path.map(print, "children"));
  },
};
