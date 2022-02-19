module.exports = {
  presets: ['@mikojs/miko'],
  plugins: ['add-module-exports'],
  env: {
    pre: {
      presets: ['@babel/env', ['@mikojs/miko', false]],
    },
  },
};
