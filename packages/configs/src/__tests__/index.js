// @flow

import path from 'path';

import getConfig from '../index';

import configs from 'utils/configs';

jest.mock(
  '../utils/sendToServer',
  () => async (data: mixed, callback: () => void) => {
    callback();
  },
);

describe('configs', () => {
  beforeAll(() => {
    configs.handleCustomConfigs({
      config: {
        getConfig: {},
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test.each`
    filePath      | ignorePath
    ${'filePath'} | ${undefined}
    ${'filePath'} | ${'ignorePath'}
  `(
    'get config with filePath = $filePath and ignorePath = $ignorePath',
    ({ filePath, ignorePath }: {| filePath: string, ignorePath: string |}) => {
      expect(getConfig('getConfig', filePath, ignorePath)).toEqual({});
    },
  );
});
