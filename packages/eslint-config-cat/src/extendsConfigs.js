// @flow

/**
 * extends eslint-config-fbjs, eslint-config-google
 * repo: https://github.com/facebook/fbjs/tree/master/packages/eslint-config-fbjs
 *       https://github.com/google/eslint-config-google
 */

export default {
  extends: ['fbjs/strict', 'google'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],

    'comma-dangle': ['error', 'always-multiline'],

    'default-case': 'error',

    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],

    'no-confusing-arrow': 'error',
    'no-extra-parens': ['error', 'functions'],
    'no-shadow': 'error',
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme'],
        location: 'anywhere',
      },
    ],

    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          consistent: true,
        },
      },
    ],

    'quote-props': ['error', 'as-needed'],

    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
      },
    ],

    strict: ['error', 'never'],

    'valid-jsdoc': 'error',
  },
};
