// @flow

module.exports = {
  testPathIgnorePatterns: ['__tests__/__ignore__'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
};
