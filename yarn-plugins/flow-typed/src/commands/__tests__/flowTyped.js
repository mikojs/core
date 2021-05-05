import { generateCli } from '@mikojs/yarn-plugin-utils/src/testing';

import FlowTyped from '../FlowTyped';

test('flow-typed', async () => {
  const cli = generateCli(FlowTyped);

  expect(await cli.run(['flow-typed', '-h'])).toBe(1);
});
