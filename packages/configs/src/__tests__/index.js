// @flow

import path from 'path';

import getConfig from 'index';
import configs from 'utils/configs';

test('get config', () => {
  configs.handleCustomConfigs({
    config: {
      getConfig: {},
    },
    filepath: path.resolve(process.cwd(), './.catrc.js'),
  });

  expect(getConfig('getConfig', path.resolve('jest.config.js'))).toEqual({});
});
