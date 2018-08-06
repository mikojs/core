// @flow

module.exports = {
  extends: ['./packages/eslint-config-cat/lib/index.js'],
  overrides: [
    {
      files: ['__tests__/**/*.js'],
      settings: {
        /** In packages/** modules */
        'import/core-modules': [
          '@cat-org/configs',
          '@cat-org/utils',
          '@cat-org/utils/lib/d3DirTree',
        ],
      },
    },
  ],
};
