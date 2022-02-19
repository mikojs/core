import { scriptUtils } from '@yarnpkg/core';

const preparePlugin = {
  title: 'Preparing builder plugin',
  task: async ctx => {
    const { workspaces } = ctx;

    ctx.useBuilderWorkspaces = [];

    await workspaces.reduce(async (result, workspace) => {
      await result;

      const binaries = await scriptUtils.getWorkspaceAccessibleBinaries(
        workspace,
      );

      if (binaries.has('builder')) ctx.useBuilderWorkspaces.push(workspace);
    }, Promise.resolve());
  },
};

const buildWorkspaces = {
  title: 'Building yarn plugins in workspaces',
  enabled: ({ useBuilderWorkspaces }) => useBuilderWorkspaces?.length !== 0,
  task: ({ useBuilderWorkspaces, runWithWorkspaces }, task) =>
    runWithWorkspaces(useBuilderWorkspaces, ['builder', 'build', 'plugin'], {
      stdout: task.stdout(),
    }),
};

export default tasks =>
  tasks.add({
    title: 'Run builder plugin',
    task: ({ normalizeTasks }, task) =>
      task.newListr(normalizeTasks(preparePlugin, buildWorkspaces)),
  });
