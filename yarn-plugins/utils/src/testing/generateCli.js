import { Cli } from 'clipanion';

import pluginConfiguration from './pluginConfiguration';

// FIXME
// eslint-disable-next-line require-jsdoc
class TestingCli extends Cli {
  run = (args, options) =>
    super.run(args, {
      plugins: pluginConfiguration,
      cwd: process.cwd(),
      ...Cli.defaultContext,
      ...options,
    });
}

export default commands => {
  const cli = new TestingCli();

  commands.forEach(command => {
    cli.register(command);
  });

  return cli;
};
