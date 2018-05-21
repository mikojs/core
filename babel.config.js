// @flow

const defaultPresets = [
  '@babel/preset-env',
  '@babel/preset-flow',
];

const defaultPlugins = [
  ['module-resolver', {
    root: ['./src'],
    cwd: __dirname,
  }],
  '@babel/plugin-proposal-optional-chaining',
];

class BabelConfig {
  constructor(presets, plugins) {
    this.presets = presets;
    this.plugins = plugins;
  }

  addAliasToModuleResolver(alias = {}) {
    const moduleResolverIndex = this.plugins
      .findIndex(plugin => plugin instanceof Array && plugin[0] === 'module-resolver');
    const newPlugins = [...this.plugins];

    newPlugins[moduleResolverIndex] = ['module-resolver', {
      ...newPlugins[moduleResolverIndex][1],
      alias,
    }];

    return new BabelConfig(this.presets, newPlugins);
  }

  addPlugin(pluginName, pluginIndex, setting) {
    const newPlugins = [...this.plugins];

    newPlugins.splice(
      pluginIndex,
      0,
      setting ? [pluginName, setting] : pluginName
    );

    return new BabelConfig(this.presets, newPlugins);
  }

  get getConfigs() {
    return {
      presets: this.presets,
      plugins: this.plugins,
    };
  }
}

module.exports = new BabelConfig(defaultPresets, defaultPlugins);
