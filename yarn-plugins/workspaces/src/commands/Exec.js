import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project, structUtils } from '@yarnpkg/core';

import findWorkspaces from '../utils/findWorkspaces';

export default class Exec extends Command {
  static usage = Command.Usage({
    category: 'Workspace-related commands',
    description: chalk`execute command with {cyan @yarnpkg/plugin-workspace-tools}`,
    details: chalk`
      Because {cyan @yarnpkg/plugin-workspace-tools} would execute command in the all workspaces included the root workspace, the root workspace is not needed for the most case. Using this command would avoid to executing command in the root workspace.
    `,
    examples: [['Show the all workspaces path', 'yarn workspaces exec pwd']],
  });

  @Command.String()
  commandName

  @Command.Proxy()
  args = [];

  @Command.Boolean('-v,--verbose')
  verbose = false;

  @Command.Boolean('-p,--parallel')
  parallel = false

  @Command.Boolean('-i,--interlaced')
  interlaced = false;

  @Command.String('-j,--jobs')
  jobs

  @Command.Array('--include')
  include = [];

  @Command.Array('--exclude')
  exclude = [];

  @Command.String('--git-range')
  gitRange

  @Command.Path('workspaces', 'exec')
  execute = async () => {
    const { cwd, plugins } = this.context;
    const { run } = this.cli;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces }, locator } = await Project.find(configuration, projectCwd);

    await run([
      'workspaces',
      'foreach',
      '--exclude',
      structUtils.stringifyIdent(locator),
      ...(!this.gitRange ? [] : await findWorkspaces(workspaces, {
        cwd: projectCwd,
        gitRange: this.gitRange,
      })),
      ...this.addFilter(this.include, '--include'),
      ...this.addFilter(this.exclude, '--exclude'),
      ...this.addOption(this.verbose, '-v'),
      ...this.addOption(this.parallel, '-p'),
      ...this.addOption(this.interlaced, '-i'),
      ...this.addOption(this.jobs, '-j', this.jobs),
      'exec',
      this.commandName,
      ...this.args
    ], {
      cwd: projectCwd
    });
  }

  addOption = (condition, ...args) => condition ? args : [];

  addFilter = (options, name) => options.reduce((result, option) => [
    ...result,
    name,
    option,
  ], []);
}
