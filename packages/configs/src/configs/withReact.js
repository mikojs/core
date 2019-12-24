// @flow

import type configsType from './index';

export default {
  babel: {
    install: (install: $ReadOnlyArray<string>) => [
      ...install,
      '@babel/preset-react',
      '@babel/plugin-proposal-class-properties',
    ],
    config: ({
      presets,
      plugins,
      ...config
    }: $Call<
      $PropertyType<$PropertyType<configsType, 'babel'>, 'config'>,
      {},
    >) => ({
      ...config,
      presets: [...presets, '@babel/react'],
      plugins: [
        ...plugins,
        [
          '@babel/proposal-class-properties',
          {
            loose: true,
          },
        ],
      ],
    }),
  },

  lint: {
    config: ({
      rules,
      ...config
    }: $Call<
      $PropertyType<$PropertyType<configsType, 'lint'>, 'config'>,
      {},
    >) => ({
      ...config,
      rules: {
        ...rules,
        'jsdoc/check-tag-names': [
          rules['jsdoc/check-tag-names'][0],
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

  jest: {
    config: ({
      setupFiles,
      ...config
    }: $Call<
      $PropertyType<$PropertyType<configsType, 'jest'>, 'config'>,
      {},
    >) => ({
      ...config,
      setupFiles: [...setupFiles, '@mikojs/jest/lib/react'],
    }),
  },
};
