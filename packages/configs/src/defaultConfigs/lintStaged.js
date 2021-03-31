// @flow

export default {
  filename: '.lintstagedrc.js',

  /**
   * @return {object} - lint-staged config
   */
  config: (): {|
    '*.js': $ReadOnlyArray<string>,
    '*.js.flow': $ReadOnlyArray<string>,
    '**/!(README).md': $ReadOnlyArray<string>,
    '**/README.md': $ReadOnlyArray<string>,
    '**/package.json': $ReadOnlyArray<string>,
  |} => ({
    '*.js': ['miko prettier', 'miko lint'],
    '*.js.flow': ['miko prettier --parser flow'],
    '**/!(README).md': ['miko prettier --parser markdown'],
    '**/README.md': ['miko prettier --parser markdown'],
    '**/package.json': [
      'prettier-package-json --write',
      'miko prettier --parser json',
    ],
  }),
};
