// @flow

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';

export default {
  /**
   * @param {object} config - prev babel config
   * @param {Array} config.plugins - babel plugins array
   *
   * @return {object} - new babel config
   */
  babel: ({ plugins, ...config }: babelType) => ({
    ...config,
    plugins: normalizeBabel.presetOrPlugin('plugin', plugins, {
      /**
       * @param {Array} option - prev babel plugin options
       * @param {string} option.0 - babel plugin name
       * @param {object} option.1 - babel plugin options
       *
       * @return {Array} - new babel plugin options
       */
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

      /**
       * @param {Array} option - prev babel plugin options
       * @param {string} option.0 - babel plugin name
       * @param {object} option.1 - babel plugin options
       *
       * @return {Array} - new babel plugin options
       */
      '@mikojs/import-css': ([plugin, options]: presetOrPluginType) => [
        plugin,
        {
          ...options,
          test: /\.css$/,
        },
      ],
    }),
  }),

  /**
   * @param {object} config - prev lint-staged config
   *
   * @return {object} - new lint-staged config
   */
  'lint-staged': (config: { '*.css'?: $ReadOnlyArray<string> }) => ({
    ...config,
    '*.css': [...(config['*.css'] || []), 'prettier --parser css --write'],
  }),
};
