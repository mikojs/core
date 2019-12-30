// @flow

import withReact from './withReact';

export default [
  withReact,
  {
    // lint
    lint: {
      config: ({
        rules,
        ...config
      }: {
        rules: {
          'jsdoc/check-tag-names': [
            string,
            {
              definedTags: $ReadOnlyArray<string>,
            },
          ],
        },
      }) => ({
        ...config,
        rules: {
          ...rules,
          'jsdoc/check-tag-names': [
            rules['jsdoc/check-tag-names'][0],
            {
              ...rules['jsdoc/check-tag-names'][1],
              definedTags: [
                ...rules['jsdoc/check-tag-names'][1].definedTags,
                'relay',
              ],
            },
          ],
        },
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
