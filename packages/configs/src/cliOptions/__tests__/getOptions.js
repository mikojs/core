// @flow

import path from 'path';

import { createLogger } from '@mikojs/utils';

import getOptions from '../getOptions';

import configs from 'utils/configs';

describe('get options', () => {
  beforeAll(() => {
    configs.loadConfig({
      config: {
        error: {
          alias: () => {
            throw new Error('error');
          },
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  test('alias error', () => {
    expect(() =>
      getOptions(createLogger('test'), {
        cliName: 'error',
        rawArgs: [],
        options: [],
      }),
    ).toThrow('error');
  });
});
