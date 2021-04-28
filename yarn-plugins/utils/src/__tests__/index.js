import fs from 'fs';
import path from 'path';

import { commands } from '..';
import { generateCli } from '../testing';

const builderFilePath = path.resolve('./node_modules/.bin/builder');
const cli = generateCli(commands, [
  ['node', builderFilePath, 'build', 'plugin'],
]);
const args = ['plugin', 'build'];

jest.mock('fs');

test('plugin build', async () => {
  fs.existsSync.mockImplementation(filePath => filePath === builderFilePath);
  await cli.run(args);

  expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
});
