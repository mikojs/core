// @flow

import withReact from './withReact';

import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default [
  withReact,
  {
    // lint
    lint: {
      config: ({ rules, ...config }: lintType) => ({
        ...config,
        rules: normalizeLint.rules(rules, {
          'jsdoc/check-tag-names': ([rule, options]: $NonMaybeType<
            $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
          >) => [
            rule || 'error',
            {
              ...options,
              definedTags: [...(options.definedTags || []), 'relay'],
            },
          ],
        }),
      }),
    },

    // jest
    jest: {
      config: ({
        testPathIgnorePatterns,
        coveragePathIgnorePatterns,
        ...config
      }: {
        testPathIgnorePatterns: $ReadOnlyArray<string>,
        coveragePathIgnorePatterns: $ReadOnlyArray<string>,
      }) => ({
        ...config,
        testPathIgnorePatterns: [
          ...testPathIgnorePatterns,
          '__tests__/__generated__',
        ],
        coveragePathIgnorePatterns: [
          ...coveragePathIgnorePatterns,
          '__generated__',
        ],
      }),
    },
  },
];
