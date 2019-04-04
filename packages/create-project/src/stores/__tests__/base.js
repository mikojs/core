// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';

import base from '../base';

test('base store without pkg in `ctx`', async () => {
  execa.cmds = [];
  base.ctx = { projectDir: 'project dir', check: false };

  expect(
    await base.end({
      projectDir: 'project dir',
      check: false,
    }),
  ).toBeUndefined();
  expect(execa.cmds).toHaveLength(3);
});
