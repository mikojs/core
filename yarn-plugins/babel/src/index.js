import { structUtils } from '@yarnpkg/core';

export default {
  hooks: {
    build: ({ workspaces }) => {
      workspaces
        .filter(({ manifest }) =>
          Array.from(manifest.devDependencies.values())
            .some(locator => structUtils.stringifyIdent(locator) === '@babel/cli')
        )
        .forEach(({ cwd }) => {
          console.log(cwd);
        });
    },
  },
};
