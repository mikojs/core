// @flow

module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/lib/',
    '<rootDir>/packages/cat-utils/lib/',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'packages/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'html',
    'text',
  ],
};
