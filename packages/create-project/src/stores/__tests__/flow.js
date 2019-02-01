// @flow

// $FlowFixMe jest mock
import { execa } from 'execa';

import flow from '../flow';

import ctx from './__ignore__/ctx';

flow.ctx = ctx;

test('flow', async () => {
  execa.cmds = [];

  expect(await flow.end()).toBeUndefined();
  expect(execa.cmds[0]).toBe('yarn add --dev flow-bin flow-typed');
});
