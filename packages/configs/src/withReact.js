// @flow

import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default {
  // lint
  lint: {
    config: ({ rules, ...config }: lintType) => ({
      ...config,
      rules: normalizeLint(rules, {
        'jsdoc/check-tag-names': ([rule, options]: $NonMaybeType<
          $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
        >) => [
          rule || 'error',
          {
            ...options,
            definedTags: [...(options.definedTags || []), 'react'],
          },
        ],
        'jsdoc/require-example': ([rule, options]: $NonMaybeType<
          $PropertyType<rulesType, 'jsdoc/require-example'>,
        >) => [
          rule || 'error',
          {
            ...options,
            exemptedBy: [...(options.exemptedBy || []), 'react'],
          },
        ],
        'jsdoc/require-param': ([rule, options]: $NonMaybeType<
          $PropertyType<rulesType, 'jsdoc/require-param'>,
        >) => [
          rule || 'error',
          {
            ...options,
            exemptedBy: [...(options.exemptedBy || []), 'react'],
          },
        ],
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
  },

  // jest
  jest: {
    config: ({
      setupFiles,
      ...config
    }: {
      setupFiles: $ReadOnlyArray<string>,
    }) => ({
      ...config,
      setupFiles: [...setupFiles, '@mikojs/jest/lib/react'],
    }),
  },
};
