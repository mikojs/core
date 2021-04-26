import path from 'path';

import { BaseCommand } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';
import { Command } from 'clipanion';

import { description } from '../package.json';

import symlinkSync from './symlinkSync';

/* eslint new-cap: ['error', { capIsNewExceptionPattern: 'Command' }] */
export default {
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
        const { cwd, plugins } = this.context;
        const configuration = await Configuration.find(cwd, plugins);
        const {
          project: { workspaces },
          workspace: {
            manifest: { dependencies, devDependencies },
          },
        } = await Project.find(configuration, cwd);
        const { projectCwd } = configuration;

        if (projectCwd === cwd) return;

        await symlinkSync(
          path.resolve(projectCwd, './.flowconfig'),
          path.resolve(cwd, './.flowconfig'),
        );
        await Promise.all(
          [...dependencies.values(), ...devDependencies.values()].map(
            ({ identHash, scope, name }) => {
              const pkgName = !scope ? name : `@${scope}/${name}`;

              return symlinkSync(
                workspaces.find(
                  ({ locator }) => locator.identHash === identHash,
                )?.cwd || path.resolve(projectCwd, './node_modules', pkgName),
                path.resolve(cwd, './node_modules', pkgName),
              );
            },
          ),
        );
      };
    },
  ],
};
