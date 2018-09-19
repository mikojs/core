// @flow

import path from 'path';

import getConfig from '..';
import jestConfigs from 'configs/jest';

test('get config', () => {
  expect(
    getConfig('jest', path.resolve(process.cwd(), 'jest.config.js')),
  ).toEqual(jestConfigs.config({}));
});
