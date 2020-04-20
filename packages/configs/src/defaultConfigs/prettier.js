// @flow

export default {
  filenames: {
    config: '.prettierrc.js',
  },
  config: () => ({
    singleQuote: true,
    arrowParens: 'avoid',
    trailingComma: 'all',
  }),
};
