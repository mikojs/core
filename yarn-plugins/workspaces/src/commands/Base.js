import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project, StreamReport, structUtils } from '@yarnpkg/core';

import findWorkspaces from '../utils/findWorkspaces';

export default class Base extends Command {
  @Command.String()
  commandName

  @Command.Proxy()
  args = [];

  @Command.Boolean('-p,--parallel', { description: chalk`This is a proxy option for {cyan \`@yarnpkg/plugin-workspace-tools\`}` })
  parallel = false

  @Command.Boolean('-i,--interlaced', { description: chalk`This is a proxy option for {cyan \`@yarnpkg/plugin-workspace-tools\`}` })
  interlaced = false;

  @Command.String('-j,--jobs', { description: chalk`This is a proxy option for {cyan \`@yarnpkg/plugin-workspace-tools\`}` })
  jobs

  @Command.Array('--include', { description: chalk`This is a proxy option for {cyan \`@yarnpkg/plugin-workspace-tools\`}` })
  include = [];

  @Command.Array('--exclude', { description: chalk`This is a proxy option for {cyan \`@yarnpkg/plugin-workspace-tools\`}` })
  exclude = [];

  @Command.Boolean('--no-prefix', { description: 'Disable workspace name prefixing' })
  noPrefix = false;

  @Command.String('--git-range', { description: chalk`Use to find workspaces with running {cyan \`git diff\`}` })
  gitRange

  addFilter = (options, name) => options.reduce((result, option) => [
    ...result,
    name,
    option,
  ], []);

  addOption = (condition, ...args) => condition ? args : [];

  buildExecute = executeCommandName => async () => {
    const { cwd, plugins, stdout } = this.context;
    const { run } = this.cli;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces }, locator } = await Project.find(configuration, projectCwd);
    const filteredWorkspaces = !this.gitRange ? [] : await findWorkspaces(workspaces, {
      cwd: projectCwd,
      gitRange: this.gitRange,
    });

    if (this.gitRange && filteredWorkspaces.length === 0) {
      await StreamReport.start({
        configuration,
        stdout,
      }, report => report.exitCode());

      return 0;
    }

    await run([
      'workspaces',
      'foreach',
      '-i',
      '--exclude',
      structUtils.stringifyIdent(locator),
      ...filteredWorkspaces,
      ...this.addFilter(this.include, '--include'),
      ...this.addFilter(this.exclude, '--exclude'),
      ...this.addOption(!this.noPrefix, '-v'),
      ...this.addOption(this.parallel, '-p'),
      ...this.addOption(this.interlaced, '-i'),
      ...this.addOption(this.jobs, '-j', this.jobs),
      executeCommandName,
      this.commandName,
      ...this.args
    ], {
      cwd: projectCwd
    });
  }
}
