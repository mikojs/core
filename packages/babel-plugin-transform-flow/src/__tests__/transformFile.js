// @flow

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';

test('transform file', () => {
  reset({
    filenames: ['not use, just mock'],
    outFile: 'lib/index.js',
  });
  // TODO should check with file-output-sync
  babel();
});
