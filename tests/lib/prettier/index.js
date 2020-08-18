const fs = require("fs");
const path = require("path");
const assert = require("assert");

const prettier = require("prettier");

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

/**
 * Format with Prettier
 */
function format(code) {
  return prettier.format(code, {
    parser: "antlr-sql",
    plugins: ["./lib/prettier"],
  });
}

describe("prettier", () => {
  for (const inputFile of listup()) {
    it("should work as plugin for prettier for inputFile", () => {
      const outputFile = inputFile.replace(/input\.sql$/, "output.sql");
      const input = fs.readFileSync(inputFile, "utf8");
      const actual = format(input);

      fs.writeFileSync(outputFile, actual, "utf8"); // save fixture
      const expected = fs.readFileSync(outputFile, "utf8");
      assert.strictEqual(actual, expected);
    });
  }
});
