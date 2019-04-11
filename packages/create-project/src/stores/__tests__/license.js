// @flow

import { outputFileSync } from 'output-file-sync';

import license from '../license';

test('license without pkg in `ctx`', async () => {
  outputFileSync.contents = [];
  license.ctx = { projectDir: 'project dir', skipCommand: false };

  expect(
    await license.end({
      projectDir: 'project dir',
      skipCommand: false,
    }),
  ).toBeUndefined();
  expect(outputFileSync.contents[0]).toMatch(/^Copyright \(c\) 2019 $/m);
});
