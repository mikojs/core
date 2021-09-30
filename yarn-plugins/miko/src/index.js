import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';

import load from './utils/load';
import normalize from './utils/normalize';

export default {
  commands: normalize(load(process.cwd())).map(
    ([command, scripts]) =>
      class MikoCommand extends Command {
        static paths = [[command]];

        static usage = Command.Usage({
          category: 'Miko-related commands',
          description: scripts.toString(),
        });

        execute = async () => {
          const { cwd, plugins } = this.context;
          const configuration = await Configuration.find(cwd, plugins);
          const { projectCwd } = configuration;
          const {
            project: { workspaces },
          } = await Project.find(configuration, projectCwd);

          await scripts.execute({ cli: this.cli, workspaces });
        };
      },
  ),
};
