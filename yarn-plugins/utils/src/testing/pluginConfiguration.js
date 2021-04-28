import pluginPnp from '@yarnpkg/plugin-pnp';

const modules = new Map();
const plugins = new Set();

modules.set('@yarnpkg/plugin-pnp', pluginPnp);
plugins.add('@yarnpkg/plugin-pnp');

export default {
  modules,
  plugins,
};
