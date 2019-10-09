// $FlowFixMe jest mock
import { net } from 'net';
import path from 'path';

import { outputFileSync } from 'output-file-sync';
import { emptyFunction } from 'fbjs';
import chalk from 'chalk';

import generateFiles from '../generateFiles';
import configs from '../configs';

jest.mock('net');

describe('generate files', () => {
  beforeAll(() => {
    configs.handleCustomConfigs({
      config: {
        notFindCli: emptyFunction.thatReturnsArgument,
        jest: {
          configFiles: {
            'babel:lerna': false,
          },
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  beforeEach(() => {
    outputFileSync.destPaths = [];
  });

  test('error', () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(generateFiles('notFindCli', 8000)).toBeFalsy();
    expect(mockLog).toHaveBeenCalledTimes(5);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{red ✖ }{red {bold @mikojs/configs}} Can not generate the config file, You can:`,
    );
  });

  test('generate', () => {
    generateFiles('jest', 8000);

    const [, callback] = net.callback.mock.calls.find(
      ([type]: [string]) => type !== 'error',
    );

    expect(outputFileSync.destPaths).toEqual(
      [
        'jest.config.js',
        'babel.config.js',
        '.eslintrc.js',
        '.eslintignore',
        '.prettierrc.js',
      ].map((fileName: string) => path.resolve(fileName)),
    );
    expect(callback()).toBeUndefined();
  });
});
