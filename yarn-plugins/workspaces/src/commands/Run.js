import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

import Base from './Base';
import buildUsage from '../utils/buildUsage';

export default class Run extends Base {
  static usage = Command.Usage(buildUsage('run script', [
    ['Run script', 'yarn workspaces run build'],
  ]));

  @Command.Path('workspaces', 'run')
  execute = this.buildExecute('run')
}
