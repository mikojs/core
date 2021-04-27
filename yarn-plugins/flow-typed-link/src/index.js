import path from 'path';

import { BaseCommand as Command } from '@yarnpkg/cli';

import findInfo from '@mikojs/yarn-plugin-utils/lib/findInfo';

import symlinkSync from './symlinkSync';

export default {
  commands: [
    class Link extends Command {
      static usage = Command.Usage({
        category: 'Flow-typed-related commands',
        description: 'link .flowconfig and packages from root workspace',
        details: `
          This command would try to find .flowconfig from root workspace and packages which are in workspaces. If this command find those files, this command would link those files to current workspace.

          If this command is used in root workspace, it would not link any anything.
        `,
        examples: [
          [
            'Link .flowconfig and packages from root workspace',
            'yarn flow-typed link',
          ],
        ],
      });

      @Command.Path('flow-typed', 'link')
      execute = async () => {
        const { cwd, plugins } = this.context;
        const {
          configuration: { projectCwd },
          project: { workspaces },
          workspace: {
            manifest: { dependencies, devDependencies },
          },
        } = await findInfo(cwd, plugins);

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
