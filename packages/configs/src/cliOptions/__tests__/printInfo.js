// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import { createLogger } from '@mikojs/utils';

import printInfo from '../printInfo';

import configs from 'utils/configs';

describe('print info', () => {
  beforeAll(() => {
    configs.loadConfig({
      config: {
        cli: {
          install: emptyFunction,
          run: emptyFunction,
          config: emptyFunction,
          ignore: emptyFunction,
          alias: 'alias',
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test('show cli info', () => {
    const mockLog = jest.fn();

    global.console.info = mockLog;

    expect(printInfo(createLogger('test'), 'cli')).toBeTruthy();
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog).toHaveBeenCalledWith(`  {
    "alias": "alias"
  }`);
  });

  test('not found cli', () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(printInfo(createLogger('test'), 'notFound')).toBeFalsy();
    expect(mockLog).toHaveBeenCalledTimes(2);
  });
});
