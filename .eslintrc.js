module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    mocha: true
  },
  extends: [
    'plugin:node/recommended',
    'eslint:recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    'require-jsdoc': 'error',
    'no-warning-comments': 'warn',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'no-var': 'error'
  }
}
