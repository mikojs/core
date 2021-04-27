import pluginPnp from '@yarnpkg/plugin-pnp';

import findProject from './findProject';

export default cwd => {
  const modules = new Map();
  const plugins = new Set();

  modules.set('@yarnpkg/plugin-pnp', pluginPnp);
  plugins.add('@yarnpkg/plugin-pnp');

  return findProject(cwd, {
    modules,
    plugins,
  });
};
