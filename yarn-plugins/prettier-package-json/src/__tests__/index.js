import { Configuration, Project } from '@yarnpkg/core';
import { execute } from '@yarnpkg/shell';
import pluginPnp from '@yarnpkg/plugin-pnp';

import prettierPackageJson from '..';

test('prettier package json', async () => {
  const cwd = process.cwd();
  const modules = new Map();
  const plugins = new Set();

  modules.set('@yarnpkg/plugin-pnp', pluginPnp);
  plugins.add('@yarnpkg/plugin-pnp');

  const configuration = await Configuration.find(cwd, { modules, plugins });
  const { project } = await Project.find(configuration, cwd);

  await prettierPackageJson.hooks.afterAllInstalled(project);

  expect(execute).toHaveBeenCalledTimes(1);
});
