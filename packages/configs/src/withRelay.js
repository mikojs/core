// @flow

import withReact from './withReact';

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';
import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default [
  withReact,
  {
    /**
     * @param {object} config - prev babel config
     * @param {Array} config.presets - babel presets array
     * @param {Array} config.plugins - babel plugins array
     *
     * @return {object} - new babel config
     */
    babel: ({ presets, plugins, ...config }: babelType) => ({
      ...config,
      presets: normalizeBabel.presetOrPlugin('preset', presets, {
        /**
         * @param {Array} option - prev babel preset options
         * @param {string} option.0 - babel preset name
         * @param {object} option.1 - babel preset options
         *
         * @return {Array} - new babel preset options
         */
        '@mikojs/base': ([preset, options]: [
          string,
          {
            '@mikojs/transform-flow'?: {
              ignore?: RegExp,
            },
          },
        ]) => [
          preset,
          {
            ...options,
            '@mikojs/transform-flow': {
              ...options['@mikojs/transform-flow'],
              ignore: /__generated__/,
            },
          },
        ],
      }),
      plugins: normalizeBabel.presetOrPlugin('plugin', plugins, {
        /**
         * @param {Array} option - prev babel plugin options
         * @param {string} option.0 - babel plugin name
         * @param {object} option.1 - babel plugin options
         *
         * @return {Array} - new babel plugin options
         */
        relay: ([plugin, options]: presetOrPluginType) => [plugin, options],
      }),
    }),

    /**
     * @param {object} config - prev lint config
     * @param {Array} config.rules - lint rules options
     *
     * @return {object} - new lint config
     */
    lint: ({ rules, ...config }: lintType) => ({
      ...config,
      rules: normalizeLint.rules(rules, {
        /**
         * @param {Array} option - prev lint rule options
         * @param {string} option.0 - lint rule name
         * @param {object} option.1 - lint rule options
         *
         * @return {Array} - new lint rule options
         */
        'jsdoc/check-tag-names': ([rule, options]: $NonMaybeType<
          $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
        >) => [
          rule || 'error',
          {
            ...options,
            definedTags: [...(options.definedTags || []), 'relay'],
          },
        ],
      }),
    }),

    /**
     * @param {object} config - prev jest config
     * @param {Array} config.testPathIgnorePatterns - jest testPathIgnorePatterns options
     * @param {Array} config.coveragePathIgnorePatterns - jest coveragePathIgnorePatterns options
     *
     * @return {object} - new jest config
     */
    jest: ({
      testPathIgnorePatterns,
      coveragePathIgnorePatterns,
      ...config
    }: {
      testPathIgnorePatterns: $ReadOnlyArray<string>,
      coveragePathIgnorePatterns: $ReadOnlyArray<string>,
    }) => ({
      ...config,
      testPathIgnorePatterns: [
        ...(testPathIgnorePatterns || []),
        '__tests__/__generated__',
      ],
      coveragePathIgnorePatterns: [
        ...(coveragePathIgnorePatterns || []),
        '__generated__',
      ],
    }),
  },
];
