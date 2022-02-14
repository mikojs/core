import { scriptUtils } from '@yarnpkg/core';

export default tasks =>
  tasks.add({
    title: 'Run builder plugin',
    task: (_, task) =>
      task.newListr([
        {
          title: 'Preparing builder plugin',
          task: async ctx => {
            const { workspaces } = ctx;

            ctx.useBuilderWorkspaces = [];

            await workspaces.reduce(async (result, workspace) => {
              await result;

              const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
                workspace,
              );

              if (binaries.has('builder'))
                ctx.useBuilderWorkspaces.push(workspace);
            }, Promise.resolve());
          },
        },
        {
          title: 'Building yarn plugins in workspaces',
          enabled: ({ useBuilderWorkspaces }) =>
            useBuilderWorkspaces?.length !== 0,
          task: ({ useBuilderWorkspaces, runWithWorkspaces }) =>
            runWithWorkspaces(
              ['builder', 'build', 'plugin'],
              useBuilderWorkspaces,
            ),
        },
      ]),
  });
