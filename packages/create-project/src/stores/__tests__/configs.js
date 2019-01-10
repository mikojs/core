// @flow

import { execa } from 'execa';

import configs from '../configs';

import ctx from './__ignore__/ctx';

configs.ctx = ctx;

test('configs', async () => {
  execa.cmds = [];

  expect(await configs.end()).toBeUndefined();
  expect(execa.cmds[1]).toBe('yarn add --dev @cat-org/configs@beta');
});
