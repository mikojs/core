// @flow

import { emptyFunction } from 'fbjs';

import prodLogger from '../prodLogger';

test('prod logger', () => {
  expect(prodLogger().log).toEqual(emptyFunction);
});
