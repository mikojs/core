// @flow

import babel from '../babel';

describe('babel', () => {
  test.each`
    configsEnv   | expected
    ${[]}        | ${['@cat-org/base']}
    ${['react']} | ${['@cat-org/base', '@babel/react']}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      expected,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(babel.config({ configsEnv }).presets).toEqual(expected);
    },
  );
});
