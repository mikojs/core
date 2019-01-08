// @flow

import gitignore from '../gitignore';

import ctx from './__ignore__/ctx';

gitignore.ctx = ctx;

test('gitignore', async () => {
  expect(await gitignore.end(ctx)).toBeUndefined();
});
