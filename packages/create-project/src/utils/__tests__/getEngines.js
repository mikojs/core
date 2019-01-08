// @flow

import { getEngines } from '../getEngines';

test('get user', async () => {
  expect(await getEngines()).toEqual({
    node: '>= node version',
    yarn: '>= yarn version',
    npm: '>= npm version',
  });
});
