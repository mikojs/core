// @flow

import normalizeBabel, {
  type babelType,
  type presetOrPluginType,
} from './normalize/babel';
import normalizeLint, { type rulesType, type lintType } from './normalize/lint';

export default {
  // babel
  babel: {
    config: ({ presets, plugins, ...config }: babelType) => ({
      ...config,
      presets: normalizeBabel.presetOrPlugin(presets, {
        '@babel/react': ([preset, options]: presetOrPluginType) => [
          preset,
          options,
        ],
      }),
      plugins: normalizeBabel.presetOrPlugin(plugins, {
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
  },

  // lint
  lint: {
    config: ({ rules, ...config }: lintType) => ({
      ...config,
      rules: normalizeLint.rules(rules, {
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
