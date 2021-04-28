process.env.NODE_ENV = 'test';

module.exports = {
  extends: '@mikojs/miko',
  overrides: [
    {
      files: [
        'yarn-plugins/**/src/commands/*.js',
        'yarn-plugins/**/src/testing/*.js',
      ],
      rules: {
        'new-cap': ['error', { capIsNewExceptionPattern: 'Command' }],
        'require-jsdoc': 'off',
      },
    },
  ],
  ignorePatterns: [
    // node
    'node_modules',

    // babel
    'lib',

    // jest
    'coverage',

    // flow
    '**/flow-typed/npm',
  ],
};
