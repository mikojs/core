// @flow

export default {
  filenames: {
    config: '.prettierrc.js',
    ignore: '.prettierignore',
  },
  config: () => ({
    singleQuote: true,
    trailingComma: 'all',
  }),
};
