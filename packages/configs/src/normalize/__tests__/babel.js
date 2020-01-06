// @flow

import babel, { type presetOrPluginType } from '../babel';

test('babel', () => {
  expect(
    babel.presetOrPlugin(['test'], {
      test: ([preset]: presetOrPluginType) => [preset],
    }),
  ).toEqual(['test']);
});
