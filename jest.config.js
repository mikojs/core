// @flow

module.exports = {
  testPathIgnorePatterns: [
    '/lib/',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/__testsFiles__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'html',
    'text',
  ],
};
