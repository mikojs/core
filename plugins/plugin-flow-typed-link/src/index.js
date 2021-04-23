import { BaseCommand } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';

import { name, description } from '../package.json';

import symlinkSync from './symlinkSync';

export default {
  name,
  factory: () => ({
    commands: [
      class Link extends BaseCommand {
        static paths = [['flow-typed', 'link']];

        static usage = {
          description,
          details: `
          `,
          examples: [],
        };

        execute = async () => {
          const configuration = await Configuration.find(
            this.context.cwd,
            this.context.plugins,
          );
          const { project, workspace } = await Project.find(
            configuration,
            this.context.cwd,
          );

          symlinkSync(project, workspace);
        };
      },
    ],
  }),
};
