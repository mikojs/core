// @flow

import babel, { type presetOrPluginType, type babelType } from '../babel';

test.each`
  presets
  ${['env']}
  ${[['env']]}
`(
  'babel',
  ({ presets }: {| presets: $PropertyType<babelType, 'presets'> |}) => {
    expect(
      babel.presetOrPlugin('preset', presets, {
        /**
         * @param {Array} option - prev babel preset options
         * @param {string} option.0 - babel preset name
         *
         * @return {Array} - new babel preset options
         */
        'babel-preset-env': ([preset]: presetOrPluginType) => [preset],
      }),
    ).toEqual(['env']);
  },
);
