// @flow

import babel, { type presetOrPluginType } from '../babel';

test('babel', () => {
  expect(
    babel.presetOrPlugin('preset', ['env'], {
      'babel-preset-env': ([preset]: presetOrPluginType) => [preset],
    }),
  ).toEqual(['env']);
});
