import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

import Base from './Base';
import buildUsage from '../utils/buildUsage';

export default class Exec extends Base {
  static usage = Command.Usage(buildUsage('execute command', [
    'Show the all workspaces path', 'yarn workspaces exec pwd'
  ]));

  @Command.Path('workspaces', 'exec')
  execute = this.buildExecute('exec')
}
