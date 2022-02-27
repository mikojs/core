import { Command, Option } from 'clipanion';
import { Configuration, Project } from '@yarnpkg/core';
import { Listr } from 'listr2';

import buildUsage from '../utils/buildUsage';

const paths = [['build'], ['dev']];

export default class Miko extends Command {
  static paths = paths;

  static usage = buildUsage(paths);

  verbose = Option.Boolean('-v,--verbose', true, {
    description: 'Log everything',
  });

  execute = async () => {
    const name = this.path.join(':');
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project } = await Project.find(configuration, projectCwd);
    const { workspaces } = project;
    const listr = new Listr([], {
      rendererOptions: { collapse: !this.verbose },
    });
    const normalizeTasks = (task, subTasks, taskOptions) =>
      task.newListr(
        subTasks.map(({ options, ...subTask }) => ({
          ...subTask,
          options: { ...options, persistentOutput: Boolean(this.verbose) },
        })),
        taskOptions,
      );

    await project.restoreInstallState();
    await configuration.triggerHook(hooks => hooks[name], listr);
    await listr.run({
      workspaces,
      runWithWorkspaces: (workspaces, commands, options) =>
        Promise.all(
          workspaces.map(({ cwd }) =>
            this.cli.run(commands, { ...options, cwd }),
          ),
        ),
      normalizeTasks,
    });
  };
}
