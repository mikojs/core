// @flow

export default {
  filenames: {
    config: '.prettierrc.js',
  },

  /**
   * @return {object} - prettier config
   */
  config: () => ({
    singleQuote: true,
    arrowParens: 'avoid',
    trailingComma: 'all',
  }),
};
