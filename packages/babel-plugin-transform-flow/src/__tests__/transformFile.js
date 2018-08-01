// @flow

import type { cliType, cliFuncType } from './definitions/cli.js.flow';

describe('transform folder', () => {
  it('babel src -d lib', () => {
    jest.mock(
      '@babel/cli/lib/babel/options',
      (): cliFuncType => (): cliType => ({
        cliOptions: {
          filename: '/src/index.js',
          outFile: '/lib/index.js',
        },
      }),
    );

    require('./__ignore__/babel').default();
  });
});
