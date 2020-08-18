const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { parse } = require('../../../lib/parser')

describe('parse', () => {
  it('should be generate AST as result of parse.', () => {
    const inputFile = path.join(__dirname, './fixtures/test01-input.sql')
    const outputFile = path.join(__dirname, './fixtures/test01-output.json')
    const input = fs.readFileSync(inputFile, 'utf8')
    const result = parse(input)

    const actual = stringify(result)
    fs.writeFileSync(outputFile, actual, 'utf8')
    const expected = fs.readFileSync(outputFile, 'utf8')
    assert.strictEqual(actual, expected)
  })
})

/**
 * Convert AST to a string.
 */
function stringify (value) {
  const circle = new Set()
  return JSON.stringify(
    value,
    (key, val) => {
      if ([
        'parser', // parser
        'start', // CommonToken
        'stop', // CommonToken
        'parentCtx' // maybe parent node
      ].includes(key)) {
        return `__@${key}__`
      }
      if (key === 'symbol') {
        // it maybe text CommonToken
        return val.text
      }
      if (val && typeof val === 'object') {
        if (circle.has(val)) {
          return '@circle'
        }
        circle.add(val)

        if (val.constructor.name !== 'Object' && val.constructor.name !== 'Array') {
          return {
            type: val.constructor.name, // Add field to check the type.
            ...val
          }
        }
      }

      return val
    },
    2
  )
}
