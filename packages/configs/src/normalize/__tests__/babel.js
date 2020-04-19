// @flow

import babel, { type presetOrPluginType } from '../babel';

test.each`
  presets
  ${['env']}
  ${[['env']]}
`('babel', ({ presets }: {| presets: $ReadOnlyArray<string> |}) => {
  expect(
    babel.presetOrPlugin('preset', presets, {
      'babel-preset-env': ([preset]: presetOrPluginType) => [preset],
    }),
  ).toEqual(['env']);
});
