const fs = require('fs');

module.exports = {
  name: '@yarnpkg/plugin-clean',
  factory: fn => {
    const { structUtils } = fn('@yarnpkg/core');

    return {
      hooks: {
        build: tasks =>
          tasks.add({
            title: 'Remove lib folder with @mikojs/yarn-plugin-*',
            task: async ({ workspaces }) => {
              const yarnPluginWorkspaces = workspaces.filter(({ locator }) =>
                /yarn-plugin/.test(structUtils.stringifyIdent(locator)),
              );

              console.log(yarnPluginWorkspaces);
            },
          }),
      },
    };
  },
};
