// @flow

export default {
  filename: '.prettierrc.js',

  /**
   * @return {object} - prettier config
   */
  config: (): {
    singleQuote: boolean,
    arrowParens: 'avoid',
    trailingComma: 'all',
  } => ({
    singleQuote: true,
    arrowParens: 'avoid',
    trailingComma: 'all',
  }),
};
