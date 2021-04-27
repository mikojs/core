import { generateCli } from '@mikojs/yarn-plugin-utils/lib/testing';

import { commands } from '..';
import symlinkSync from '../symlinkSync';

const cli = generateCli(commands);
const args = ['flow-typed', 'link'];

jest.mock('../symlinkSync', () => jest.fn());

describe('flow-typed link', () => {
  beforeEach(() => {
    symlinkSync.mockClear();
  });

  test('skip root workspace', async () => {
    await cli.run(args);

    expect(symlinkSync).not.toHaveBeenCalled();
  });

  test('link files in workspace', async () => {
    await cli.run(args, {
      cwd: __dirname,
    });

    expect(symlinkSync).toHaveBeenCalled();
  });
});
