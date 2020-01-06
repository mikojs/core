// @flow

import babel, { type presetOrPluginType } from '../babel';

test('babel', () => {
  expect(
    babel.presetOrPlugin(['test'], {
      test: ([preset, options]: presetOrPluginType) => [preset, options],
    }),
  ).toEqual(['test']);
});
