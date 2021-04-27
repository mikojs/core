import { Cli } from 'clipanion';
import pluginPnp from '@yarnpkg/plugin-pnp';

import { commands } from '..';
import symlinkSync from '../symlinkSync';

const cli = new Cli();
const args = ['flow-typed', 'link'];
const defaultContext = {
  ...Cli.defaultContext,
  cwd: process.cwd(),
  plugins: {
    modules: new Map(),
    plugins: new Set(),
  },
};

jest.mock('../symlinkSync', () => jest.fn());

describe('flow-typed link', () => {
  beforeAll(() => {
    symlinkSync.mockClear();
    commands.forEach(command => {
      cli.register(command);
    });
    defaultContext.plugins.modules.set('@yarnpkg/plugin-pnp', pluginPnp);
    defaultContext.plugins.plugins.add('@yarnpkg/plugin-pnp');
  });

  test('skip root workspace', async () => {
    await cli.run(args, defaultContext);

    expect(symlinkSync).not.toHaveBeenCalled();
  });

  test('link files in workspace', async () => {
    await cli.run(args, {
      ...defaultContext,
      cwd: __dirname,
    });

    expect(symlinkSync).toHaveBeenCalled();
  });
});
