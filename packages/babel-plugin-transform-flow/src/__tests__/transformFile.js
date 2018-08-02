// @flow

import type { cliType, cliFuncType } from './definitions/cli.js.flow';

test('transform file', () => {
  jest.mock(
    '@babel/cli/lib/babel/options',
    (): cliFuncType => (): cliType => ({
      cliOptions: {
        filenames: ['not use, just mock'],
        outFile: 'lib/index.js',
      },
    }),
  );

  // TODO should check with file-output-sync
  require('./__ignore__/babel').default('index.js');
});
