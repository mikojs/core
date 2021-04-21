import fs from 'fs';
import path from 'path';

import prettier from 'prettier';

import { name } from '../package.json';

export default {
  name,
  factory: () => ({
    hooks: {
      afterAllInstalled: async project => {
        const options = await prettier.resolveConfig();

        project.workspaces.forEach(workspace => {
          const pkgPath = path.resolve(workspace.cwd, './package.json');

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
