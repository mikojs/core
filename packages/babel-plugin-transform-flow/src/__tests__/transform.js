// @flow

import { resetDestPaths, getDestPaths } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import {
  transformFileOptions,
  transformFolderOptions,
  indexFiles,
  hasFlowFileFiles,
} from './__ignore__/constants';

test('transform file', () => {
  reset(transformFileOptions);
  resetDestPaths();
  babel();

  expect(getDestPaths()).toEqual(indexFiles);
});

describe('transform folder', () => {
  beforeEach(() => {
    reset(transformFolderOptions);
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
