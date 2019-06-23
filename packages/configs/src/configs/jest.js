// @flow

import { type Options as OptionsType } from 'jest';

export default {
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'jest',
    'babel-jest',
    '@cat-org/jest',
  ],
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--coverage=false'],
  config: ({
    configsEnv,
  }: {
    configsEnv: $ReadOnlyArray<string>,
  }): OptionsType => ({
    setupFiles: [
      '@cat-org/jest',
      ...(!configsEnv.includes('react') ? [] : ['@cat-org/jest/lib/react']),
    ],
    testPathIgnorePatterns: ['__tests__/__ignore__'],
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
    babel: true,
  },
};
