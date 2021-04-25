/* eslint new-cap: ['error', { capIsNewExceptionPattern: 'Command' }] */

import { BaseCommand } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';
import { Command } from 'clipanion';

import { name, description } from '../package.json';

import symlinkSync from './symlinkSync';

export default {
  name,
  factory: () => ({
    commands: [
      class Link extends BaseCommand {
        static usage = Command.Usage({
          description,
          details: `
          `,
          examples: [],
        });

        @Command.Path('flow-typed', 'link')
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
