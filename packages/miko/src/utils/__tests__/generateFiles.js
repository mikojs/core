// @flow

import path from 'path';

import outputFileSync from 'output-file-sync';

import testingLogger from '@mikojs/logger/lib/testingLogger';

import generateFiles from '../generateFiles';
import configsCache from '../configsCache';

configsCache.load({
  filepath: path.resolve('.mikorc.js'),
  config: [
    {
      babel: {
        filename: 'babel.config.js',

        /**
         * @return {object} - config object
         */
        config: () => ({ key: 'value' }),
      },
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
        '.prettierrc.js',
        '.lintstagedrc.js',
      ]
        .sort()
        .map((filePath: string) => path.resolve(process.cwd(), filePath)),
    );
    expect(
      outputFileSync.mock.calls
        .map(([outputFilePath]: [string]) => outputFilePath)
        .sort(),
    ).toEqual(result);
  });
});
