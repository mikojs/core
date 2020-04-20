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
        'babel-preset-env': ([preset]: presetOrPluginType) => [preset],
      }),
    ).toEqual(['env']);
  },
);
