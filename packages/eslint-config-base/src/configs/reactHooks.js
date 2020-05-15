// @flow

/**
 * extend eslint-plugin-react-hooks
 * repo: https://github.com/facebook/react
 */
export default {
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
