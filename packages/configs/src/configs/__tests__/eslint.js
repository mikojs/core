// @flow

import eslint from '../eslint';

const reactRules = {
  'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
  'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
  'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
};

describe('eslint', () => {
  test.each`
    configsEnv   | customTags                                   | rules
    ${[]}        | ${['flow', 'jest-environment']}              | ${{}}
    ${['react']} | ${['flow', 'jest-environment', 'react']}     | ${reactRules}
    ${['relay']} | ${['flow', 'jest-environment', 'relayHash']} | ${{}}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      customTags,
      rules,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      customTags: $ReadOnlyArray<string>,
      rules: {},
    |}) => {
      const config = eslint.config({ configsEnv });

      expect(config.settings.jsdoc.additionalTagNames.customTags).toEqual(
        customTags,
      );
      expect(config.rules).toEqual(rules);
    },
  );
});
