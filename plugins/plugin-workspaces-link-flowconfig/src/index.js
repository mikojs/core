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
          workspaces.reduce((result, { cwd }) => {
            if (cwd === rootCwd) return result;

            return [
              ...result,
              symlinkSync(
                path.resolve(rootCwd, './.flowconfig'),
                path.resolve(cwd, './.flowconfig'),
              ),
            ];
          }, []),
        );
      },
    },
  }),
};
