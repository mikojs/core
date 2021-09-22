module.exports = {
  alias: {
    babel: 'babel src -d lib --verbose --root-mode upward',
  },
  scripts: {
    build: 'babel',
  },
};
