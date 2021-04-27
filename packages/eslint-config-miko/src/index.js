const config = {
  parser: '@babel/eslint-parser',
  extends: ['fbjs/strict', 'google', 'prettier'],
  rules: {
    // FIXME: remove when eslint upgrade
    'no-invalid-this': 'off',
    'babel/no-invalid-this': 'error',
  },
};

export default config;
