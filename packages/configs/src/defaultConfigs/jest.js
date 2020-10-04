// @flow

export default {
  filenames: {
    config: 'jest.config.js',
  },

  /**
   * @return {object} - jest config
   */
  config: (): {|
    setupFiles: $ReadOnlyArray<string>,
    testPathIgnorePatterns: $ReadOnlyArray<string>,
    collectCoverage: boolean,
    collectCoverageFrom: $ReadOnlyArray<string>,
    coverageDirectory: string,
    coveragePathIgnorePatterns: $ReadOnlyArray<string>,
    coverageReporters: $ReadOnlyArray<string>,
    coverageThreshold: {|
      global: {|
        branches: number,
        functions: number,
        lines: number,
        statements: number,
      |},
    |},
  |} => ({
    setupFiles: ['@mikojs/jest'],
    testPathIgnorePatterns: ['__tests__/__ignore__'],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/src/**/*.js',
      '**/src/**/.*/**/*.js',
      '!**/bin/*.js',
    ],
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
  }),
};
