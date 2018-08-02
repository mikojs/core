// @flow

import type { cliType, cliFuncType } from './definitions/cli.js.flow';

describe('transform folder', () => {
  beforeEach(() => {
    jest.mock(
      '@babel/cli/lib/babel/options',
      (): cliFuncType => (): cliType => ({
        cliOptions: {
          filenames: ['not use, just mock'],
          outDir: 'lib',
        },
      }),
    );
  });

  it('transform file which do not have the same name file and extension is `.js.flow`', () => {
    // TODO should check with file-output-sync
    require('./__ignore__/babel').default('index.js');
    // TODO should test not write again
    require('./__ignore__/babel').default('index.js', false);
  });

  it('transform file which have the same name file and extension is `.js.flow`', () => {
    // TODO should check with file-output-sync
    require('./__ignore__/babel').default('hasFlowFile.js');
    // TODO should test not write again
    require('./__ignore__/babel').default('hasFlowFile.js', false);
  });
});
