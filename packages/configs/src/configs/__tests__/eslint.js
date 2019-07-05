// @flow

import eslint from '../eslint';

describe('eslint', () => {
  test.each`
    configsEnv   | extendConfig              | customTags
    ${[]}        | ${[]}                     | ${['flow', 'jest-environment']}
    ${['react']} | ${['@cat-org/cat/react']} | ${['flow', 'jest-environment', 'react']}
    ${['relay']} | ${[]}                     | ${['flow', 'jest-environment', 'relayHash']}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      extendConfig,
      customTags,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      extendConfig: $ReadOnlyArray<string>,
      customTags: $ReadOnlyArray<string>,
    |}) => {
      const config = eslint.config({ configsEnv });

      expect(config.extends).toEqual(['@cat-org/cat', ...extendConfig]);
      expect(config.settings.jsdoc.additionalTagNames.customTags).toEqual(
        customTags,
      );
    },
  );
});
