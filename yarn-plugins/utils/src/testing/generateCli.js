import { Cli, Command } from 'clipanion';

import pluginConfiguration from './pluginConfiguration';

class TestingCli extends Cli {
  run = (args, options) =>
    super.run(args, {
      plugins: pluginConfiguration,
      cwd: process.cwd(),
      ...Cli.defaultContext,
      ...options,
    });
}

export default (command, mockCommands = []) => {
  const cli = new TestingCli();

  cli.register(command);
  mockCommands.forEach(mockCommand => {
    cli.register(
      class MockCommand extends Command {
        @Command.Path(...mockCommand)
        execute = jest.fn();
      },
    );
  });

  return cli;
};
