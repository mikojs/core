// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';

import getUser from '../getUser';

jest.mock('memoize-one', () => jest.fn((func: mixed) => func));

test('not set git user', async () => {
  execa.mainFunction = () => {
    throw new Error('not set git user');
  };

  await expect(getUser()).rejects.toThrow('process exit');
});
