// @flow

/**
 * extends eslint-plugin-jsdoc
 * repo: https://github.com/gajus/eslint-plugin-jsdoc
 */

export default {
  extends: ['plugin:jsdoc/recommended'],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
      additionalTagNames: {
        customTags: ['flow', 'jest-environment'],
      },
    },
  },
  rules: {
    'jsdoc/require-example': 'error',
    'jsdoc/require-hyphen-before-param-description': 'error',
    'jsdoc/require-jsdoc': [
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
  },
};
