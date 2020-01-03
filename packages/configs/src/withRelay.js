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
    // babel
    babel: {
      config: ({ presets, plugins, ...config }: babelType) => ({
        ...config,
        presets: normalizeBabel.presetOrPlugin(presets, {
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
        plugins: normalizeBabel.presetOrPlugin(plugins, {
          relay: ([preset, options]: presetOrPluginType) => [preset, options],
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
              definedTags: [...(options.definedTags || []), 'relay'],
            },
          ],
        }),
      }),
    },

    // jest
    jest: {
      config: ({
        testPathIgnorePatterns,
        coveragePathIgnorePatterns,
        ...config
      }: {
        testPathIgnorePatterns: $ReadOnlyArray<string>,
        coveragePathIgnorePatterns: $ReadOnlyArray<string>,
      }) => ({
        ...config,
        testPathIgnorePatterns: [
          ...testPathIgnorePatterns,
          '__tests__/__generated__',
        ],
        coveragePathIgnorePatterns: [
          ...coveragePathIgnorePatterns,
          '__generated__',
        ],
      }),
    },
  },
];
