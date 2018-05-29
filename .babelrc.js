module.exports = {
  extends: './babel.config',
  plugins: [
    ['module-resolver', {
      root: ['./src', './packages'],
    }],
  ],
};
