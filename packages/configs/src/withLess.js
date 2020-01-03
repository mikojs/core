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
    babel: {
      config: ({ plugins, ...config }: babelType) => ({
        ...config,
        plugins: normalizeBabel.presetOrPlugin(plugins, {
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
    },
  },
];
