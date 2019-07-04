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

    // FIXME: remove when eslint upgrade
    'no-invalid-this': 'off',
    'babel/no-invalid-this': 'error',

    'prefer-destructuring': 'error',

    strict: ['error', 'never'],

    // FIXME: remove after eslint remove
    'require-jsdoc': 'off',
  },
};
