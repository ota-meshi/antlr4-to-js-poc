// @ts-check
const parser = require("./parser");
const printer = require("./printer");
/** @type {import('prettier').Plugin} */
const plugin = {
  languages: [
    {
      name: "sql",
      parsers: ["antlr-sql"],
    },
  ],
  parsers: {
    "antlr-sql": parser,
  },
  printers: {
    "antlr-sql-ast": printer,
  },
};

module.exports = plugin;
