// @flow

import path from 'path';

import { npmWhich } from 'npm-which';

import cliOptions from '../cliOptions';

const defaultArgv = ['node', 'lerna-create'];

describe('cli options', () => {
  test('work', () => {
    expect(cliOptions([...defaultArgv, 'new-project'])).toEqual({
      newProject: path.resolve('new-project'),
      rootPath: process.cwd(),
      workspaces: ['packages/*', 'server/*'],
    });
  });

  test.each`
    info                     | argv
    ${'no new project name'} | ${[]}
    ${'project exist'}       | ${['../../..']}
  `('$info', ({ argv }: { argv: $ReadOnlyArray<string> }) => {
    expect(() => {
      cliOptions([...defaultArgv, ...argv]);
    }).toThrow('process exit');
  });

  test('not find lerna', () => {
    npmWhich.throwError = true;

    expect(() => {
      cliOptions([...defaultArgv, 'new-project']);
    }).toThrow('process exit');

    npmWhich.throwError = false;
  });

  test('not find workspaces', () => {
    npmWhich.alias = {
      lerna: __dirname,
    };

    expect(() => {
      cliOptions([...defaultArgv, 'new-project']);
    }).toThrow('process exit');

    npmWhich.alias = {};
  });
});
