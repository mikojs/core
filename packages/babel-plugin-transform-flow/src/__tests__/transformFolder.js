// @flow

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';

describe('transform folder', () => {
  beforeEach(() => {
    reset({
      filenames: ['not use, just mock'],
      outDir: 'lib',
    });
  });

  it('transform file which do not have the same name file and extension is `.js.flow`', () => {
    // TODO should check with file-output-sync
    babel();
    // TODO should test not write again
    babel();
  });

  it('transform file which have the same name file and extension is `.js.flow`', () => {
    // TODO should check with file-output-sync
    babel('hasFlowFile.js');
    // TODO should test not write again
    babel('hasFlowFile.js');
  });
});
