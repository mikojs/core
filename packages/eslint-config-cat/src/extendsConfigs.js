// @flow

/**
 * extends eslint-config-fbjs, eslint-config-google
 * repo: https://github.com/facebook/fbjs/tree/master/packages/eslint-config-fbjs
 *       https://github.com/google/eslint-config-google
 */

export default {
  extends: [
    'fbjs/strict',
    'google',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/standard',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],

    'default-case': 'error',

    'no-shadow': 'error',
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme'],
        location: 'anywhere',
      },
    ],

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
