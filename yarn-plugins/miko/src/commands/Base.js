import { Command } from 'clipanion';
import { Configuration, Project } from '@yarnpkg/core';

export default class Base extends Command {
  execute = async () => {
    const name = this.constructor.name.replace(/^.{1}/, str =>
      str.toLowerCase(),
    );
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const {
      project: { workspaces },
    } = await Project.find(configuration, projectCwd);

    await project.restoreInstallState();
    await configuration.triggerHook(hooks => hooks[name], {
      cli: this.cli,
      workspaces,
    });
  };
}
