// @flow

import withReact from './withReact';

export default [
  withReact,
  {
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
  },
];
