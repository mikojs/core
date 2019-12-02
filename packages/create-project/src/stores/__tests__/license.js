// @flow

import outputFileSync from 'output-file-sync';

import license from '../license';

test('license without pkg in `ctx`', async () => {
  license.ctx = {
    projectDir: 'project dir',
    skipCommand: false,
    lerna: false,
    verbose: true,
  };

  expect(
    await license.end({
      projectDir: 'project dir',
      skipCommand: false,
      lerna: false,
      verbose: true,
    }),
  ).toBeUndefined();
  expect(outputFileSync.mock.calls[0][1]).toMatch(/^Copyright \(c\) 2019 $/m);
});
