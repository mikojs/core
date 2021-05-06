import { generateCli } from '@mikojs/yarn-plugin-utils/src/testing';

import FlowTyped from '../FlowTyped';

test('flow-typed', async () => {
  const cli = generateCli(FlowTyped, [['run', 'flow-typed', 'install']]);

  expect(await cli.run(['flow-typed', 'install'])).toBe(0);
});
