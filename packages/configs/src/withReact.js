// @flow

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';
import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default {
  /**
   * @param {object} config - prev babel config
   * @param {Array} config.presets - babel presets array
   * @param {Array} config.plugins - babel plugins array
   *
   * @return {object} - new babel config
   */
  babel: ({ presets, plugins, ...config }: babelType): babelType => ({
    ...config,
    presets: normalizeBabel.presetOrPlugin('preset', presets, {
      /**
       * @param {Array} option - prev babel preset options
       * @param {string} option.0 - babel preset name
       * @param {object} option.1 - babel preset options
       *
       * @return {Array} - new babel preset options
       */
      '@babel/react': ([preset, options]: presetOrPluginType) => [
        preset,
        options,
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
      '@babel/proposal-class-properties': ([
        plugin,
        options,
      ]: presetOrPluginType) => [
        plugin,
        {
          ...options,
          loose: true,
        },
      ],
    }),
  }),

  /**
   * @param {object} config - prev lint config
   * @param {Array} config.rules - lint rules options
   *
   * @return {object} - new lint config
   */
  lint: ({ rules, ...config }: lintType): lintType => ({
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
          definedTags: [...(options.definedTags || []), 'react'],
        },
      ],

      /**
       * @param {Array} option - prev lint rule options
       * @param {string} option.0 - lint rule name
       * @param {object} option.1 - lint rule options
       *
       * @return {Array} - new lint rule options
       */
      'jsdoc/require-param': ([rule, options]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/require-param'>,
      >) => [
        rule || 'error',
        {
          ...options,
          exemptedBy: [...(options.exemptedBy || []), 'react'],
        },
      ],

      /**
       * @param {Array} option - prev lint rule options
       * @param {string} option.0 - lint rule name
       * @param {object} option.1 - lint rule options
       *
       * @return {Array} - new lint rule options
       */
      'jsdoc/require-returns': ([rule, options]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/require-returns'>,
      >) => [
        rule || 'error',
        {
          ...options,
          exemptedBy: [...(options.exemptedBy || []), 'react'],
        },
      ],
    }),
  }),

  /**
   * @param {object} config - prev jest config
   * @param {Array} config.setupFiles - jest setupFiles options
   *
   * @return {object} - new jest config
   */
  jest: ({
    setupFiles,
    ...config
  }: {
    setupFiles: $ReadOnlyArray<string>,
  }): {
    setupFiles: $ReadOnlyArray<string>,
  } => ({
    ...config,
    setupFiles: [...(setupFiles || []), '@mikojs/jest/lib/react'],
  }),
};
