module.exports = {
  testPathIgnorePatterns: ['__tests__/__ignore__'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['bin', '__tests__'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: -10,
    },
  },
};
