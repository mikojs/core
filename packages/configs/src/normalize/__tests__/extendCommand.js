// @flow

import extendCommand from '../extendCommand';

test('extend command', () => {
  expect(extendCommand(() => 'test', 'default')).toBe('test');
});
