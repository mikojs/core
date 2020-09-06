// @flow

export default {
  filenames: {
    config: '.lintstagedrc.js',
  },

  /**
   * @return {object} - lint-staged config
   */
  config: () => ({
    '*.js': ['miko prettier', 'miko lint'],
    '*.js.flow': ['miko prettier --parser flow'],
    '**/!(README).md': ['miko prettier --parser markdown'],
    '**/README.md': ['badges', 'miko prettier --parser markdown'],
    '**/package.json': [
      'prettier-package-json --write',
      'miko prettier --parser json',
    ],
  }),
};
