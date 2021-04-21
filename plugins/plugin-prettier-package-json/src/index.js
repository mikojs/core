import fs from 'fs';
import path from 'path';

import prettier from 'prettier';

import { name } from '../package.json';

export default {
  name,
  factory: () => ({
    hooks: {
      afterAllInstalled: async ({ workspaces }) => {
        const options = await prettier.resolveConfig();

        workspaces.forEach(({ cwd }) => {
          const pkgPath = path.resolve(cwd, './package.json');

          fs.writeFileSync(
            pkgPath,
            prettier.format(fs.readFileSync(pkgPath, 'utf-8'), {
              ...options,
              parser: 'json',
            }),
          );
        });
      },
    },
  }),
};
