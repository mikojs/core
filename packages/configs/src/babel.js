// @flow

export default {
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  ignore: process.env.NODE_ENV === 'test' ? [] : ['**/__tests__/**'],
};
