// @flow

export default {
  filenames: {
    config: '.eslintrc.js',
    ignore: '.eslintignore',
  },
  config: () => ({
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
  ignore: () => [
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
