// @flow

import eslint from '../eslint';

describe('eslint', () => {
  test.each`
    configsEnv   | expected
    ${[]}        | ${'@cat-org/cat'}
    ${['relay']} | ${'@cat-org/cat/relay'}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      expected,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(eslint.config({ configsEnv }).extends).toEqual(expected);
    },
  );
});
