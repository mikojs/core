// @flow
/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */

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

/** create babelrc */
class BabelConfig {
  /**
   * @example
   * const babelConfig = new BabelConfig(presets, plugins);
   *
   * @param {Array} presets - array of presets for .babelrc
   * @param {Array} plugins - array of plugins for .babelrc
  */
  constructor(presets, plugins) {
    this.presets = presets;
    this.plugins = plugins;
  }

  /**
   * @example
   * babelConfig.addAliasToModuleResolver({
   *   key: 'value',
   * });
   *
   * @param {Object} alias - alias for babel-plugin-module-resolver
   * @return {BabelConfig} - new BabelConfig with new setting
  */
  addAliasToModuleResolver(alias = {}) {
    const moduleResolverIndex = this.plugins
      .findIndex(plugin =>
        plugin instanceof Array && plugin[0] === 'module-resolver'
      );
    const newPlugins = [...this.plugins];

    newPlugins[moduleResolverIndex] = ['module-resolver', {
      ...newPlugins[moduleResolverIndex][1],
      alias,
    }];

    return new BabelConfig(this.presets, newPlugins);
  }

  /**
   * @example
   * babelConfig.addPreset('@babel/preset-stage-0', 1, {
   *   key: 'value',
   * });
   *
   * @param {string} presetName - name of new preset
   * @param {number} presetIndex - index of new preset
   * @param {Object} setting - setting of new preset
   * @return {BabelConfig} - new BabelConfig with new setting
  */
  addPreset(presetName, presetIndex, setting) {
    const newPresets = [...this.presets];

    newPresets.splice(
      presetIndex,
      0,
      setting ? [presetName, setting] : presetName
    );

    return new BabelConfig(newPresets, this.plugins);
  }

  /**
   * @example
   * babelConfig.addPlugin('add-module-exports', -1, {
   *   key: 'value',
   * });
   *
   * @param {string} pluginName - name of new plugin
   * @param {number} pluginIndex - index of new plugin
   * @param {Object} setting - setting of new plugin
   * @return {BabelConfig} - new BabelConfig with new setting
  */
  addPlugin(pluginName, pluginIndex, setting) {
    const newPlugins = [...this.plugins];

    newPlugins.splice(
      pluginIndex,
      0,
      setting ? [pluginName, setting] : pluginName
    );

    return new BabelConfig(this.presets, newPlugins);
  }

  /**
   * @example
   * const configs = babelConfig.addConfigs({
   *   ignore: [
   *     'ignore',
   *   ],
   * });
   *
   * @param {Object} configs - add new configs to babelrc
   * @return {Object} - babelrc
  */
  addConfigs(configs = {}) {
    return {
      ...configs,
      presets: this.presets,
      plugins: this.plugins,
    };
  }

  /**
   * @example
   * const configs = babelConfig.getConfigs;
  */
  get getConfigs() {
    return {
      presets: this.presets,
      plugins: this.plugins,
    };
  }
}

module.exports = new BabelConfig(defaultPresets, defaultPlugins);
