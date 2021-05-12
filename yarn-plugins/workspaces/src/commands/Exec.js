import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

import Base from './Base';

export default class Exec extends Base {
  static usage = Command.Usage({
    category: 'Workspace-related commands',
    description: chalk`execute command with {cyan \`@yarnpkg/plugin-workspace-tools\`}`,
    details: chalk`
      Because {cyan \`@yarnpkg/plugin-workspace-tools\`} would execute command in the all workspaces included the root workspace, the root workspace is not needed for the most case. Using this command would avoid to executing command in the root workspace.
    `,
    examples: [['Show the all workspaces path', 'yarn workspaces exec pwd']],
  });

  @Command.Path('workspaces', 'exec')
  execute = this.buildExecute('exec')
}
