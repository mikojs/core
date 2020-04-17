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
        config: () => ({ key: 'value' }),
      },
      hasIgnore: {
        filenames: {
          ignore: 'hasIgnore.js',
        },
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

  test.each`
    configNames  | expected
    ${[]}        | ${['babel.config.js', 'jest.config.js', '.eslintrc.js', '.eslintignore', '.prettierrc.js', '.prettierignore', '.lintstagedrc.js', 'hasIgnore.js']}
    ${['babel']} | ${['babel.config.js']}
  `(
    'generate files with configNames = $configNames',
    ({
      configNames,
      expected,
    }: {|
      configNames: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      const mockLog = jest.fn();

      global.console.warn = mockLog;

      const result = [...generateFiles(configNames)].sort();

      expect(result).toEqual(
        [...expected]
          .sort()
          .map((filePath: string) => path.resolve(process.cwd(), filePath)),
      );
      expect(
        outputFileSync.mock.calls
          .map(([outputFilePath]: [string]) => outputFilePath)
          .sort(),
      ).toEqual(result);

      if (expected.includes('hasIgnore.js')) {
        expect(mockLog).toHaveBeenCalledTimes(1);
        expect(mockLog).toHaveBeenCalledWith(
          chalk`{yellow ⚠ }{yellow {bold @mikojs/miko}} {red hasIgnore.js} should be added in {bold {gray .gitignore}}`,
        );
      }
    },
  );
});
