// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';
import chalk from 'chalk';

import generateFiles from '../generateFiles';
import cache from '../cache';

cache.load({
  filepath: path.resolve('.mikorc.js'),
  config: [
    {
      noConfigAndIgnore: {},
      babel: {
        filenames: {
          config: 'babel.config.js',
        },

        /**
         * @return {object} - config object
         */
        config: () => ({ key: 'value' }),
      },
      hasIgnore: {
        filenames: {
          ignore: 'hasIgnore.js',
        },

        /**
         * @return {Array} - ignore array
         */
        ignore: () => [],
      },
    },
    {
      hasIgnore: {},
    },
  ],
});

describe('generate files', () => {
  beforeEach(() => {
    outputFileSync.mockClear();
  });

  test('generate files', () => {
    const mockLog = jest.fn();

    global.console.warn = mockLog;

    const result = [...generateFiles()].sort();

    expect(result).toEqual(
      [
        'babel.config.js',
        'jest.config.js',
        '.eslintrc.js',
        '.eslintignore',
        '.prettierrc.js',
        '.lintstagedrc.js',
        'hasIgnore.js',
      ]
        .sort()
        .map((filePath: string) => path.resolve(process.cwd(), filePath)),
    );
    expect(
      outputFileSync.mock.calls
        .map(([outputFilePath]: [string]) => outputFilePath)
        .sort(),
    ).toEqual(result);
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(
      chalk`{yellow ⚠ }{yellow {bold @mikojs/miko}} {red hasIgnore.js} should be added in {bold {gray .gitignore}}`,
    );
  });
});
