const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { parse } = require("../../../lib/parser");

/**
 * Listup files
 */
function listup() {
  const rootDir = path.join(__dirname, "../../fixtures");
  return fs
    .readdirSync(rootDir)
    .filter((fileName) => fileName.endsWith("input.sql"))
    .map((fileName) => path.join(rootDir, fileName));
}

describe("prettier", () => {
  for (const inputFile of listup()) {
    it(`should be generate AST as result of parse for ${inputFile}`, () => {
      const outputFile = inputFile.replace(/input\.sql$/, "output.json");
      const input = fs.readFileSync(inputFile, "utf8");
      const result = parse(input);

      const actual = stringify(result);
      fs.writeFileSync(outputFile, actual, "utf8"); // save fixture
      const expected = fs.readFileSync(outputFile, "utf8");
      assert.strictEqual(actual, expected);
    });
  }
});

/**
 * Convert AST to a string.
 */
function stringify(value) {
  const obj = normalizeNode(value);
  obj.tokens = value.tokens.map(normalizeToken);
  return JSON.stringify(obj, null, 2);
}

/**
 * Normalize node
 * @param {import('antlr4').AntlrRule | import('antlr4/tree/Tree').TerminalNode} node
 */
function normalizeNode(node) {
  const children = [];
  const count = node.getChildCount();
  for (let index = 0; index < count; index++) {
    children.push(normalizeNode(node.getChild(index)));
  }

  const normal = {
    // Add field to check the type.
    type: node.constructor.name,
    children,
    // ParserRuleContext
    ruleIndex: node.ruleIndex,
    // exception: node.exception, // Exception!
    start: node.start && node.start.start,
    stop: node.stop && node.stop.stop,
    // RuleContext
    invokingState: node.invokingState,
    parentCtx: undefined, // parent

    // TerminalNode
    ...(node.symbol ? { text: node.getText() } : {}),
  };
  return normal;
}

/**
 * Normalize token
 * @param {import('antlr4').Token} token
 */
function normalizeToken(token) {
  return {
    text: token.text,
    type: token.type,
    channel: token.channel,
    start: token.start,
    stop: token.stop,
    tokenIndex: token.tokenIndex,
    line: token.line,
    column: token.column,
  };
}
