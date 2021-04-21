import path from 'path';

import { name } from '../package.json';

import symlinkSync from './symlinkSync';

export default {
  name,
  factory: () => ({
    hooks: {
      afterAllInstalled: async ({
        topLevelWorkspace: { cwd: rootCwd },
        workspaces,
      }) => {
        await Promise.all(
          workspaces.reduce(
            (result, { cwd, manifest: { dependencies, devDependencies } }) =>
              cwd === rootCwd
                ? result
                : [
                    ...result,
                    symlinkSync(
                      path.resolve(rootCwd, './.flowconfig'),
                      path.resolve(cwd, './.flowconfig'),
                    ),
                    ...[
                      ...dependencies.values(),
                      ...devDependencies.values(),
                    ].map(({ identHash, scope, name }) => {
                      const pkgName = !scope ? name : `@${scope}/${name}`;

                      return symlinkSync(
                        workspaces.find(
                          ({ locator }) => locator.identHash === identHash,
                        )?.cwd ||
                          path.resolve(rootCwd, './node_modules', pkgName),
                        path.resolve(cwd, './node_modules', pkgName),
                      );
                    }),
                  ],
            [],
          ),
        );
      },
    },
  }),
};
