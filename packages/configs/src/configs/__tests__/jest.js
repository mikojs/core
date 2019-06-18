// @flow

import jest from '../jest';

describe('jest', () => {
  test.each`
    configsEnv   | expected
    ${[]}        | ${['@cat-org/jest']}
    ${['react']} | ${['@cat-org/jest', '@cat-org/jest/lib/react']}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      expected,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(jest.config({ configsEnv }).setupFiles).toEqual(expected);
    },
  );

  test('run with configsEnv = relay', () => {
    expect(
      jest.config({ configsEnv: ['relay'] }).coveragePathIgnorePatterns,
    ).toEqual(['__tests__/__ignore__', '__generated__']);
  });
});
