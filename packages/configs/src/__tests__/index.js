// @flow

// $FlowFixMe jest mock
import { net } from 'net';
import path from 'path';

import getConfig from '../index';

import configs from 'utils/configs';

jest.mock('net');

describe('configs', () => {
  beforeAll(() => {
    configs.handleCustomConfigs({
      config: {
        getConfig: {},
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  beforeEach(() => {
    net.callback.mockClear();
  });

  test.each`
    filePath      | ignorePath
    ${'filePath'} | ${undefined}
    ${'filePath'} | ${'ignorePath'}
  `(
    'get config with filePath = $filePath and ignorePath = $ignorePath',
    ({ filePath, ignorePath }: {| filePath: string, ignorePath: string |}) => {
      expect(getConfig('getConfig', 8000, filePath, ignorePath)).toEqual({});

      net.callback.mock.calls.forEach(
        ([type, callback]: [string, () => void]) => {
          if (type !== 'error') expect(callback()).toBeUndefined();
        },
      );
    },
  );
});
