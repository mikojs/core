// @flow

module.exports = {
  extends: ['./packages/eslint-config-cat/lib/index.js'],
  overrides: [
    {
      files: ['__tests__/**/*.js'],
      settings: {
        /** In packages/**. */
        'import/core-modules': [
          '@cat-org/configs',
          '@cat-org/utils',
          '@cat-org/utils/lib/d3DirTree',
        ],
      },
    },
    {
      files: ['packages/babel-plugin-transform-flow/**/*.js'],
      settings: {
        /**
         * Install mkdirp with @babel/cli.
         * Install @babel/helper-plugin-utils with @babel/preset-env.
         */
        'import/core-modules': ['mkdirp', '@babel/helper-plugin-utils'],
      },
    },
    {
      files: ['packages/configs/**/*.js'],
      settings: {
        /** Only install @cat-org/utils by user who need */
        'import/core-modules': ['@cat-org/utils'],
      },
    },
  ],
};
