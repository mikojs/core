// @flow

import path from 'path';

import { resetDestPaths, getDestPaths } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { indexFiles, hasFlowFileFiles } from './__ignore__/constants';

describe('transform folder', () => {
  beforeEach(() => {
    reset({
      filenames: [
        path
          .resolve(__dirname, './__ignore__/files')
          .replace(process.cwd(), '.'),
      ],
      outDir: 'lib',
    });
    resetDestPaths();
  });

  it('transform file which do not have the same name file and extension is `.js.flow`', () => {
    babel();
    expect(getDestPaths()).toEqual(indexFiles);

    babel();
    expect(getDestPaths()).toEqual([...indexFiles, 'lib/index.js.flow']);
  });

  it('transform file which have the same name file and extension is `.js.flow`', () => {
    babel('hasFlowFile.js');
    expect(getDestPaths()).toEqual(hasFlowFileFiles);

    babel('hasFlowFile.js');
    expect(getDestPaths()).toEqual(hasFlowFileFiles);
  });
});
