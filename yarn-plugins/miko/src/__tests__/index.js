import { generateCli } from '@mikojs/yarn-plugin-utils/src/testing';

import { commands } from '..';

const cli = generateCli(commands);
const args = ['miko-todo', 'babel'];

test('miko', async () => {
  await cli.run(args);
});
