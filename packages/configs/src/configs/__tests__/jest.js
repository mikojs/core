// @flow

import jest from '../jest';

describe('jest', () => {
  test.each`
    configsEnv   | setupFiles                    | testPathIgnorePatterns         | coveragePathIgnorePatterns
    ${[]}        | ${[]}                         | ${[]}                          | ${[]}
    ${['react']} | ${['@mikojs/jest/lib/react']} | ${[]}                          | ${[]}
    ${['relay']} | ${[]}                         | ${['__tests__/__generated__']} | ${['__generated__']}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      setupFiles,
      testPathIgnorePatterns,
      coveragePathIgnorePatterns,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      setupFiles: $ReadOnlyArray<string>,
      testPathIgnorePatterns: $ReadOnlyArray<string>,
      coveragePathIgnorePatterns: $ReadOnlyArray<string>,
    |}) => {
      const result = jest.config({ configsEnv });

      expect(result.setupFiles).toEqual(['@mikojs/jest', ...setupFiles]);
      expect(result.testPathIgnorePatterns).toEqual([
        '__tests__/__ignore__',
        ...testPathIgnorePatterns,
      ]);
      expect(result.coveragePathIgnorePatterns).toEqual([
        '__tests__/__ignore__',
        ...coveragePathIgnorePatterns,
      ]);
    },
  );
});
