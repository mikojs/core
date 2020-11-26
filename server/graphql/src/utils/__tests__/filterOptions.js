// @flow

import filterOptions from '../filterOptions';

test('filter options', () => {
  const expected = { key: 'value' };

  expect(filterOptions(expected, ['key', 'foo'])).toEqual(expected);
});
