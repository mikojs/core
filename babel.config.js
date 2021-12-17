module.exports = {
  presets: ['@mikojs/miko'],
  plugins: ['@babel/proposal-class-properties', 'add-module-exports'],
  env: {
    pre: {
      presets: ['@babel/preset-env', ['@mikojs/miko', false]],
    },
  },
};
