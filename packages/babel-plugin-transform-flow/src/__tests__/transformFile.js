// @flow

import path from 'path';

import { resetDestPaths, getDestPaths } from 'output-file-sync';

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';
import { indexFiles } from './__ignore__/constants';

test('transform file', () => {
  reset({
    filenames: [
      path
        .resolve(__dirname, './__ignore__/files/index.js')
        .replace(process.cwd(), '.'),
    ],
    outFile: 'lib/index.js',
  });
  resetDestPaths();
  babel();

  expect(getDestPaths()).toEqual(indexFiles);
});
