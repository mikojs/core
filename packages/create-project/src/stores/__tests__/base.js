// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';

import base from '../base';

test('base store without pkg in `ctx`', async () => {
  execa.cmds = [];
  base.ctx = { projectDir: 'project dir' };

  expect(
    await base.end({
      projectDir: 'project dir',
    }),
  ).toBeUndefined();
  expect(execa.cmds).toHaveLength(3);
});
