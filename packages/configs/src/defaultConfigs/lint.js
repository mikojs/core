// @flow

export default {
  filenames: {
    config: '.eslintrc.js',
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
    ignorePatterns: $ReadOnlyArray<string>,
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
    ignorePatterns: [
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
  }),
};
