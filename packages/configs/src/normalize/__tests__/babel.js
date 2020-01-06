// @flow

import babel, { type presetOrPluginType } from '../babel';

test('babel', () => {
  expect(
    babel.presetOrPlugin('preset', ['test'], {
      test: ([preset]: presetOrPluginType) => [preset],
    }),
  ).toEqual(['test']);
});
