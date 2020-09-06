// @flow

import withCss from './withCss';

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';

export default [
  withCss,
  {
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
            test: /\.less$/,
          },
        ],
      }),
    }),

    /**
     * @param {object} config - prev lint-staged config
     *
     * @return {object} - new lint-staged config
     */
    'lint-staged': (config: { '*.less'?: $ReadOnlyArray<string> }) => ({
      ...config,
      '*.less': [...(config['*.less'] || []), 'prettier --parser less --write'],
    }),
  },
];
