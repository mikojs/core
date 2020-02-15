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
    configs.loadConfig({
      config: {
        cliStr: emptyFunction.thatReturnsArgument,
        cliFunc: {
          alias: emptyFunction.thatReturnsArgument,
        },
        fileNotIgnore: {
          configsFiles: {
            fileNotIgnore: './fileNotIgnore.js',
          },
        },
        jest: {
          configsFiles: {
            prettier: false,
          },
        },
      },
      filepath: path.resolve(process.cwd(), './.catrc.js'),
    });
  });

  beforeEach(() => {
    outputFileSync.mockClear();
  });

  test.each`
    cliName
    ${'cliStr'}
    ${'cliFunc'}
  `(
    'empty configsFiles with cliName = $cliName',
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

  test('config file is not added in .gitignore', async () => {
    const mockLog = jest.fn();

    global.console.warn = mockLog;

    expect(await generateFiles('fileNotIgnore')).toBeTruthy();
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{yellow ⚠ }{yellow {bold @mikojs/configs}} {red fileNotIgnore.js} should be added in {bold {gray .gitignore}}`,
    );
  });

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
