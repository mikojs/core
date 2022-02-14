import { Command } from 'clipanion';
import { Configuration, Project } from '@yarnpkg/core';
import { Listr } from 'listr2';

export default class Miko extends Command {
  static paths = [['dev'], ['build']];

  execute = async () => {
    const name = this.path.join('.');
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project } = await Project.find(configuration, projectCwd);
    const { workspaces } = project;
    const tasks = new Listr();

    await project.restoreInstallState();
    await configuration.triggerHook(hooks => hooks[name], tasks);
    await tasks.run({
      workspaces,
      runWithWorkspaces: (commands, workspaces) =>
        Promise.all(
          workspaces.map(({ cwd }) => this.cli.run(commands, { cwd })),
        ),
    });
  };
}
