// @flow

import eslint from '../eslint';

describe('eslint', () => {
  test.each`
    configsEnv   | expected
    ${[]}        | ${['flow', 'jest-environment']}
    ${['relay']} | ${['flow', 'jest-environment', 'relayHash']}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      expected,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(
        eslint.config({ configsEnv }).settings.jsdoc.additionalTagNames
          .customTags,
      ).toEqual(expected);
    },
  );
});
