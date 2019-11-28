// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';
import { emptyFunction } from 'fbjs';
import chalk from 'chalk';

import generateFiles from '../generateFiles';
import configs from '../configs';

jest.mock('../sendToServer', () => (data: mixed, callback: () => void) => {
  callback();
});

describe('generate files', () => {
  beforeAll(() => {
    configs.handleCustomConfigs({
      config: {
        notFindCli: emptyFunction.thatReturnsArgument,
        jest: {
          configsFiles: {
            'babel:lerna': false,
          },
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  beforeEach(() => {
    outputFileSync.mockReset();
  });

  test.each`
    cliName
    ${'notFindCli'}
    ${'exec'}
  `(
    'error with cliName = $cliName',
    async ({ cliName }: {| cliName: string |}) => {
      const mockLog = jest.fn();

      global.console.error = mockLog;

      expect(await generateFiles(cliName)).toBeFalsy();
      expect(mockLog).toHaveBeenCalledTimes(5);
      expect(mockLog).toHaveBeenCalledWith(
        chalk`{red ✖ }{red {bold @mikojs/configs}} Can not generate the config file, You can:`,
      );
    },
  );

  test('generate', async () => {
    expect(await generateFiles('jest')).toBeTruthy();
    expect(
      outputFileSync.mock.calls.map(
        ([outputFilePath]: [string]) => outputFilePath,
      ),
    ).toEqual(
      [
        'jest.config.js',
        'babel.config.js',
        '.eslintrc.js',
        '.eslintignore',
        '.prettierrc.js',
      ].map((fileName: string) => path.resolve(fileName)),
    );
  });
});
