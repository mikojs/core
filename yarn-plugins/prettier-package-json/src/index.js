import path from 'path';

import { execute } from '@yarnpkg/shell';

export default {
  hooks: {
    afterAllInstalled: async ({ workspaces }) => {
      await execute('yarn', [
        'prettier',
        '--loglevel',
        'silent',
        '--write',
        '--parser',
        'json',
        ...workspaces.map(({ cwd }) => path.resolve(cwd, './package.json')),
      ]);
    },
  },
};
