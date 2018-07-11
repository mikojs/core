// @flow

module.exports = {
  extends: ['./packages/eslint-config-cat/lib/index.js'],
  settings: {
    'import/core-modules': [
      // Use for ignore @cat-org/configs in @cat-org/root
      '@cat-org/configs/lib/babel',
      // Use for ignore @cat-org/utils in @cat-org/root
      '@cat-org/utils',
      '@cat-org/utils/lib/d3DirTree',
    ],
  },
};
