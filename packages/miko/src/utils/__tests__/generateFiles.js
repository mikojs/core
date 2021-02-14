// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';
import chalk from 'chalk';

import testingLogger from '@mikojs/logger/lib/testingLogger';

import generateFiles from '../generateFiles';
import configsCache from '../configsCache';

configsCache.load({
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
    testingLogger.reset();
    outputFileSync.mockClear();
  });

  test('generate files', async () => {
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
    expect((await testingLogger.getInstance())?.lastFrame()).toMatch(
      chalk`{red hasIgnore.js} should be added in {bold {gray .gitignore}}`,
    );
  });
});
