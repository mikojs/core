import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

import Base from './Base';

export default class Run extends Base {
  static usage = Command.Usage({
    category: 'Workspace-related commands',
    description: chalk`run script with {cyan \`@yarnpkg/plugin-workspace-tools\`}`,
    details: chalk`
      Because {cyan \`@yarnpkg/plugin-workspace-tools\`} would run script in the all workspaces included the root workspace, the root workspace is not needed for the most case. Using this command would avoid to running script in the root workspace.

      On the other hand, this command also add some helpful options to find the specific workspaces.
    `,
    examples: [['Run script', 'yarn workspaces run build']],
  });

  @Command.Path('workspaces', 'run')
  execute = this.buildExecute('run')
}
