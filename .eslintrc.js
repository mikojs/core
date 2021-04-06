process.env.NODE_ENV = 'test';

module.exports = {
  extends: '@mikojs/miko',
  ignorePatterns: [
    // node
    'node_modules',

    // babel
    'lib',

    // jest
    'coverage',
  ],
};
