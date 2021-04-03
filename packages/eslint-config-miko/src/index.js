const config = {
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  extends: [
    'fbjs/strict',
    'google',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/standard',
  ],
};

export default config;
