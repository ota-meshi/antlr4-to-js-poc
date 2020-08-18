# PoC for SQL parser with [ANTLR v4]

## Goal

[ANTLR v4] can generate source code that can be executed as JavaScript from a grammar file.  
Use this to see if we can create a parser that can be used in JavaScript from SQL grammar.

See also to [antlr/antlr4/doc/javascript-target.md](https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md)

## Usage this Project

### Installation

```bash
git clone https://github.com/ota-meshi/antlr4-to-js-poc.git
cd ./antlr4-to-js-poc
git submodule update --init
npm i
npm run download-antlr-complete
```

### Build a Parser using [ANTLR v4]

```bash
npm run build-antlr_psql
```

### Testing

```bash
npm run test
```

See [tests/lib/parser/index.js](tests/lib/parser/index.js) for details.

## Used Tools and Data

- [ANTLR v4] ... It uses a parser generator and runtime. License: [BSD 3-clause](https://github.com/antlr/antlr4/blob/master/LICENSE.txt)
- [tshprecher/antlr_psql] ... We are using the SQL grammar file created by `antlr_psql` project. License: [MIT](https://github.com/tshprecher/antlr_psql/blob/master/LICENSE)

[ANTLR v4]: https://github.com/antlr/antlr4
[tshprecher/antlr_psql]: https://github.com/tshprecher/antlr_psql