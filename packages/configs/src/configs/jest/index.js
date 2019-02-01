// @flow

export const config = {
  setupFiles: ['@cat-org/jest'],
  testPathIgnorePatterns: ['__tests__/__ignore__'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js', '!**/bin/*.js'],
  coveragePathIgnorePatterns: ['__tests__/__ignore__'],
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

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'jest',
    'babel-jest',
    'babel-core@^7.0.0-0',
    '@cat-org/jest',
  ],
  config: () => config,
  configFiles: {
    babel: true,
  },
};
