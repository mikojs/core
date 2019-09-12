// @flow

import lint from '../lint';

const defaultRules = {
  'jsdoc/check-tag-names': [
    'error',
    {
      definedTags: ['flow', 'jest-environment'],
    },
  ],
};

const reactRules = {
  ...defaultRules,
  'jsdoc/check-tag-names': [
    'error',
    {
      definedTags: [
        ...defaultRules['jsdoc/check-tag-names'][1].definedTags,
        'react',
      ],
    },
  ],
  'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
  'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
  'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
};

const relayRules = {
  ...defaultRules,
  'jsdoc/check-tag-names': [
    'error',
    {
      definedTags: [
        ...defaultRules['jsdoc/check-tag-names'][1].definedTags,
        'relayHash',
      ],
    },
  ],
};

describe('lint', () => {
  test.each`
    configsEnv   | rules
    ${[]}        | ${defaultRules}
    ${['react']} | ${reactRules}
    ${['relay']} | ${relayRules}
  `(
    'run with configsEnv = $configsEnv',
    ({
      configsEnv,
      rules,
    }: {|
      configsEnv: $ReadOnlyArray<string>,
      rules: {},
    |}) => {
      expect(lint.config({ configsEnv }).rules).toEqual(rules);
    },
  );
});
