// @flow

export default {
  filenames: {
    config: '.eslintrc.js',
    ignore: '.eslintignore',
  },

  /**
   * @return {object} - lint config
   */
  config: (): {|
    extends: string,
    rules: {|
      'jsdoc/check-tag-names': [
        string,
        {| definedTags: $ReadOnlyArray<string> |},
      ],
    |},
  |} => ({
    extends: '@mikojs/base',
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['flow', 'jest-environment'],
        },
      ],
    },
  }),

  /**
   * @return {Array} - lint ignore
   */
  ignore: (): $ReadOnlyArray<string> => [
    // node
    'node_modules',

    // babel
    'lib',

    // flow
    '**/flow-typed/npm',

    // jest
    'coverage',

    // add checking other configs
    '!.*',
  ],
};
