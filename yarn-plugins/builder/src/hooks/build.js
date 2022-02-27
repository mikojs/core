import { scriptUtils } from '@yarnpkg/core';

const preparePlugin = {
  title: 'Prepare builder plugin',
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
  title: 'Build yarn plugins in workspaces',
  enabled: ({ useBuilderWorkspaces }) => useBuilderWorkspaces?.length !== 0,
  task: ({ useBuilderWorkspaces, workspacesTasks }, task) =>
    workspacesTasks(task, useBuilderWorkspaces, ['builder', 'build', 'plugin']),
};

export default tasks =>
  tasks.add({
    title: 'Run builder plugin',
    task: ({ normalizeTasks }, task) =>
      normalizeTasks(task, [preparePlugin, buildWorkspaces]),
  });
