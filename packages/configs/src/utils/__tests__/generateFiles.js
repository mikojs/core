// @flow

import path from 'path';

import { outputFileSync } from 'output-file-sync';
import { emptyFunction } from 'fbjs';

import generateFiles from '../generateFiles';
import configs from '../configs';
import worker from '../worker';

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
    expect(() => {
      generateFiles('notFindCli');
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
      ].map((fileName: string) => path.resolve(fileName)),
    );
  });
});
