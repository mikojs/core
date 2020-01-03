// @flow

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';

export default {
  // babel
  babel: {
    config: ({ presets, plugins, ...config }: babelType) => ({
      ...config,
      presets: normalizeBabel.presetOrPlugin(presets, {
        '@mikojs/base': ([preset, options]: [
          string,
          {
            '@mikojs/transform-flow'?: {
              plugins?: $PropertyType<babelType, 'plugins'>,
            },
          },
        ]) => [
          preset,
          {
            ...options,
            '@mikojs/transform-flow': {
              ...options['@mikojs/transform-flow'],
              plugins: normalizeBabel.presetOrPlugin(
                options['@mikojs/transform-flow']?.plugins,
                {
                  '@babel/proposal-pipeline-operator': ([
                    subPreset,
                    subOptions,
                  ]: presetOrPluginType) => [
                    subPreset,
                    {
                      ...subOptions,
                      proposal: 'minimal',
                    },
                  ],
                },
              ),
            },
          },
        ],
      }),
      plugins: normalizeBabel.presetOrPlugin(plugins, {
        '@babel/proposal-pipeline-operator': ([
          plugin,
          options,
        ]: presetOrPluginType) => [
          plugin,
          {
            ...options,
            proposal: 'minimal',
          },
        ],
      }),
    }),
  },
};
