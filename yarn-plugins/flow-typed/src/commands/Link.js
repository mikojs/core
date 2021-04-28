import path from 'path';

import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

import findInfo from '@mikojs/yarn-plugin-utils/lib/findInfo';

import symlinkSync from '../utils/symlinkSync';

export default class Link extends Command {
  static usage = Command.Usage({
    category: 'Flow-typed-related commands',
    description: chalk`link {cyan \`.flowconfig\`} and {cyan \`packages\`} from root workspace`,
    details: chalk`
      This command would try to find {cyan \`.flowconfig\`} from root workspace and packages which are in workspaces. If this command find those files, this command would link those files to current workspace.

      If this command is used in root workspace, it would not link any anything.
    `,
    examples: [
      [
        chalk`Link {cyan \`.flowconfig\`} and {cyan \`packages\`} from root workspace`,
        'yarn flow-typed link',
      ],
    ],
  });

  @Command.Path('flow-typed', 'link')
  execute = async () => {
    const { cwd, plugins, stdout } = this.context;
    const {
      configuration: { projectCwd },
      project: { workspaces },
      workspace: {
        manifest: { dependencies, devDependencies },
      },
    } = await findInfo(cwd, plugins);

    if (projectCwd === cwd) {
      stdout.write(
        chalk`Skip linking {cyan \`.flowconfig\`} and {cyan \`pacakges\`}.\n`,
      );
      return;
    }

    await symlinkSync(
      path.resolve(projectCwd, './.flowconfig'),
      path.resolve(cwd, './.flowconfig'),
    );
    await Promise.all(
      [...dependencies.values(), ...devDependencies.values()].map(
        ({ identHash, scope, name }) => {
          const pkgName = !scope ? name : `@${scope}/${name}`;

          return symlinkSync(
            workspaces.find(({ locator }) => locator.identHash === identHash)
              ?.cwd || path.resolve(projectCwd, './node_modules', pkgName),
            path.resolve(cwd, './node_modules', pkgName),
          );
        },
      ),
    );
    stdout.write(
      chalk`{cyan \`.flowconfig\`} and {cyan \`packages\`} are linked.\n`,
    );
  };
}
