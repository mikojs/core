import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';

export default class Build extends Command {
  @Command.Path('build')
  execute = async () => {
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces } } = await Project.find(configuration, projectCwd);

    await configuration.triggerHook(
      ({ build }) => build,
      { cli: this.cli, workspaces },
    );
  };
}
