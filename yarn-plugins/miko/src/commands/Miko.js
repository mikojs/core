import { Command, Option } from 'clipanion';
import { Configuration, Project } from '@yarnpkg/core';
import { Listr } from 'listr2';

export default class Miko extends Command {
  static paths = [['dev'], ['build']];

  static usage = Command.Usage({
    category: 'Miko-related commands',
    description: 'some custom scripts for development life cycle',
    details: `
      At first, you should add some plugins for \`@mikojs/yarn-plugin-miko\`. For example, you could add plugin like \`{ hooks: { build: () => { ... } } }\`.

      When you run the custom script, like \`yarn build\`, \`@mikojs/yarn-plugin-miko\` would trigger the \`build\` hooks in the plugins.

      We add \`${Miko.paths
        .map(path => path.join(':'))
        .join(
          '`, `',
        )}\` stages for development life cycle. If you need, you could install \`@mikojs/yarn-plugin-miko\` and replace paths as you need.
    `,
    examples: Miko.paths.map(path => [
      `Run \`${path.join(':')}\` stage in development life cycle`,
      `$0 ${path.join(' ')}`,
    ]),
  });

  verbose = Option.Boolean('-v,--verbose', true, {
    description: 'Log everything',
  });

  execute = async () => {
    const name = this.path.join('.');
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project } = await Project.find(configuration, projectCwd);
    const { workspaces } = project;
    const listr = new Listr([], {
      rendererOptions: { collapse: !this.verbose },
    });

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
      normalizeTasks: (...tasks) =>
        tasks.map(task => ({
          ...task,
          options: { persistentOutput: Boolean(this.verbose) },
        })),
    });
  };
}
