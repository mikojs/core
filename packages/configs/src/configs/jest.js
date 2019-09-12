// @flow

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'jest',
    '@cat-org/jest',
  ],
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--coverage=false'],
  config: ({ configsEnv }: { configsEnv: $ReadOnlyArray<string> }) => ({
    setupFiles: [
      '@cat-org/jest',
      ...(!configsEnv.includes('react') ? [] : ['@cat-org/jest/lib/react']),
    ],
    testPathIgnorePatterns: [
      '__tests__/__ignore__',
      ...(!configsEnv.includes('relay') ? [] : ['__tests__/__generated__']),
    ],
    collectCoverage: true,
    collectCoverageFrom: ['**/src/**/*.js', '!**/bin/*.js'],
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
  configFiles: {
    jest: 'jest.config.js',
    babel: true,
  },
};
