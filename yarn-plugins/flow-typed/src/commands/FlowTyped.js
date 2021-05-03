import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

export default class FlowTyped extends Command {
  static usage = Command.Usage({
    category: 'Flow-typed-related commands',
    description: chalk`a proxy command to run the real {cyan \`flow-typed\`} command`,
    details: chalk`
      {cyan \`@mikojs/yarn-plugin-flow-typed\`} has extended {cyan \`flow-typed\`} command. To make other {cyan \`flow-typed\`} commands work, {cyan \`@mikojs/yarn-plugin-flow-typed\`} use this proxy command.
    `,
    examples: [
      [
        chalk`Use this command as {cyan \`flow-typed\`} command`,
        'yarn flow-typed install',
      ],
    ],
  });

  @Command.Proxy()
  args = [];

  @Command.Path('flow-typed')
  execute = () =>
    this.cli.run(['node', require.resolve('flow-typed'), ...this.args]);
}
