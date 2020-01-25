// @flow

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';

export default {
  // babel
  babel: ({ plugins, ...config }: babelType) => ({
    ...config,
    plugins: normalizeBabel.presetOrPlugin('plugin', plugins, {
      'css-modules-transform': ([plugin, options]: [
        string,
        {
          extensions: $ReadOnlyArray<string>,
          devMode: boolean,
          keepImport: boolean,
          extractCss: {
            dir: string,
            relativeRoot: string,
            filename: string,
          },
        },
      ]) => [
        plugin,
        {
          ...options,
          extensions: ['.css'],
          devMode: process.env.NODE_ENV !== 'production',
          keepImport: process.env.NODE_ENV !== 'test',
          extractCss: {
            ...options.extractCss,
            dir: './lib',
            relativeRoot: './src',
            filename: '[path]/[name].css',
          },
        },
      ],
      '@mikojs/import-css': ([plugin, options]: presetOrPluginType) => [
        plugin,
        {
          ...options,
          test: /\.css$/,
        },
      ],
    }),
  }),

  // lint-staged
  'lint-staged': (config: { '*.css'?: $ReadOnlyArray<string> }) => ({
    ...config,
    '*.css': [...(config['*.css'] || []), 'prettier --parser css --write'],
  }),
};
