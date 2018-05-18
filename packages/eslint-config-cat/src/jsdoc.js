// @flow

/**
 * extends eslint-plugin-jsdoc
 * repo: https://github.com/gajus/eslint-plugin-jsdoc
*/

export default {
  plugins: [
    'jsdoc',
  ],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
    },
  },
  rules: {
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/require-description-complete-sentence': 'off',
    'jsdoc/require-example': 'error',
    'jsdoc/require-hyphen-before-param-description': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-returns-type': 'error',
  },
};
