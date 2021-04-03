const config = {
  parser: '@babel/parser',
  extends: [
    'fbjs/strict',
    'google',
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/standard',
  ],
};

export default config;
