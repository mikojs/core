module.exports = {
  alias: {
    babel: 'src -d lib --verbose --root-mode upward',
  },
  scripts: {
    build: 'babel',
  },
};
