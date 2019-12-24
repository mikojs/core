// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'jest',
    '@mikojs/jest',
  ],
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--coverage=false'],
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    setupFiles: ['@mikojs/jest'],
    testPathIgnorePatterns: [
      '__tests__/__ignore__',
      ...(!configsEnv.includes('relay') ? [] : ['__tests__/__generated__']),
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/src/**/*.js',
      '**/src/**/.*/**/*.js',
      '!**/bin/*.js',
    ],
    coveragePathIgnorePatterns: [
      '__tests__/__ignore__',
      ...(!configsEnv.includes('relay') ? [] : ['__generated__']),
    ],
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
  configsFiles: {
    jest: 'jest.config.js',
    babel: true,
  },
};
