// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import getConfig from 'index';
import configs from 'utils/configs';

test('get config', () => {
  configs.store['get config'] = emptyFunction.thatReturnsArgument;

  expect(
    getConfig('get config', path.resolve(process.cwd(), 'jest.config.js')),
  ).toEqual({});
});
