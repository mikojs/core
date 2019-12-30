// @flow

export default {
  // lint
  lint: {
    config: ({
      rules,
      ...config
    }: {
      rules: {
        'jsdoc/check-tag-names':
          | string
          | [
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
        'jsdoc/check-tag-names':
          typeof rules['jsdoc/check-tag-names'] === 'string'
            ? [
                rules['jsdoc/check-tag-names'],
                {
                  definedTags: ['react'],
                },
              ]
            : [
                'error',
                {
                  ...rules['jsdoc/check-tag-names'][1],
                  definedTags: [
                    ...rules['jsdoc/check-tag-names'][1].definedTags,
                    'react',
                  ],
                },
              ],
        'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
        'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
        'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
      },
    }),
  },

  // jest
  jest: {
    config: ({
      setupFiles,
      ...config
    }: {
      setupFiles: $ReadOnlyArray<string>,
    }) => ({
      ...config,
      setupFiles: [...setupFiles, '@mikojs/jest/lib/react'],
    }),
  },
};
