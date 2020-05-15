// @flow

import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default {
  // lint
  lint: ({ rules, ...config }: lintType) => ({
    ...config,
    rules: normalizeLint.rules(rules, {
      'jsdoc/check-tag-names': ([rule, options]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
      >) => [
        rule || 'error',
        {
          ...options,
          definedTags: [...(options.definedTags || []), 'middleware'],
        },
      ],
      'jsdoc/require-param': ([rule, options]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/require-param'>,
      >) => [
        rule || 'error',
        {
          ...options,
          exemptedBy: [...(options.exemptedBy || []), 'middleware'],
        },
      ],
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
