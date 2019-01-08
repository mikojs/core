// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';
import { emptyFunction } from 'fbjs';

import generateFiles from '../generateFiles';
import configs from '../configs';
import worker from '../worker';

configs.store['not-find-cli-setting'] = emptyFunction.thatReturnsArgument;

describe('generate files', () => {
  beforeEach(() => {
    outputFileSync.destPaths = [];
  });

  test('error', () => {
    expect(() => {
      generateFiles('not-find-cli-setting');
    }).toThrow('process exit');
  });

  test('generate', () => {
    generateFiles('jest');

    expect(worker.server).toBeNull();
    expect(outputFileSync.destPaths).toEqual(
      [
        'babel.config.js',
        '.prettierrc.js',
        '.eslintrc.js',
        '.eslintignore',
        'jest.config.js',
      ].map((fileName: string): string => path.resolve(fileName)),
    );
  });
});
