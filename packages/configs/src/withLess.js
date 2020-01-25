// @flow

import withCss from './withCss';

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';

export default [
  withCss,
  {
    // babel
    babel: ({ plugins, ...config }: babelType) => ({
      ...config,
      plugins: normalizeBabel.presetOrPlugin('plugin', plugins, {
        'css-modules-transform': ([plugin, options]: [
          string,
          {
            extensions: $ReadOnlyArray<string>,
            extractCss: {
              filename: string,
            },
          },
        ]) => [
          plugin,
          {
            ...options,
            extensions: ['.less'],
            extractCss: {
              ...options.extractCss,
              filename: '[path]/[name].less',
            },
          },
        ],
        '@mikojs/import-css': ([plugin, options]: presetOrPluginType) => [
          plugin,
          {
            ...options,
            test: /\.less$/,
          },
        ],
      }),
    }),

    // lint-staged
    'lint-staged': (config: { '*.less'?: $ReadOnlyArray<string> }) => ({
      ...config,
      '*.less': [...(config['*.less'] || []), 'prettier --parser less --write'],
    }),
  },
];
