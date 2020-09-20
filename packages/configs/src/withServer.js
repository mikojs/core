// @flow

import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default {
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
          definedTags: [...(options.definedTags || []), 'middleware'],
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
          exemptedBy: [...(options.exemptedBy || []), 'middleware'],
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
          exemptedBy: [...(options.exemptedBy || []), 'middleware'],
        },
      ],
    }),
  }),
};
