// @flow

export type presetOrPluginType = [string, {}];

type stringPresetOrPluginType = $TupleMap<
  $ReadOnlyArray<presetOrPluginType>,
  <V>(V) => V | string,
>;

export type babelType = {
  presets?: stringPresetOrPluginType,
  plugins?: stringPresetOrPluginType,
};

const EXACT_RE = /^module:/;
const BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-plugin-)/;
const BABEL_PRESET_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-preset-)/;
const BABEL_PLUGIN_ORG_RE = /^(@babel\/)(?!plugin-|[^/]+\/)/;
const BABEL_PRESET_ORG_RE = /^(@babel\/)(?!preset-|[^/]+\/)/;
const OTHER_PLUGIN_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-plugin(?:-|\/|$)|[^/]+\/)/;
const OTHER_PRESET_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-preset(?:-|\/|$)|[^/]+\/)/;
const OTHER_ORG_DEFAULT_RE = /^(@(?!babel$)[^/]+)$/;

/**
 * https://github.com/babel/babel/blob/e85faec47d5d3ef940b7a85d48fa24e6e1cc32ab/packages/babel-core/src/config/files/plugins.js
 *
 * @example
 * standardizeName('preset', '@babel/presets-env');
 *
 * @param {string} type - plugin or preset
 * @param {string} presetOrPlugin - name of plugin or preset
 *
 * @return {string} - standardize name
 */
const standardizeName = (
  type: 'plugin' | 'preset',
  presetOrPlugin: presetOrPluginType | string,
): presetOrPluginType | string => {
  if (presetOrPlugin instanceof Array) return presetOrPlugin;

  const isPreset = type === 'preset';

  return presetOrPlugin
    .replace(
      isPreset ? BABEL_PRESET_PREFIX_RE : BABEL_PLUGIN_PREFIX_RE,
      `babel-${type}-`,
    )
    .replace(isPreset ? BABEL_PRESET_ORG_RE : BABEL_PLUGIN_ORG_RE, `$1${type}-`)
    .replace(
      isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE,
      `$1babel-${type}-`,
    )
    .replace(OTHER_ORG_DEFAULT_RE, `$1/babel-${type}`)
    .replace(EXACT_RE, '');
};

/**
 * @example
 * removeEmptyOption(['pluginName'])
 *
 * @param {presetOrPluginType} presetOrPlugin - preset or plugin
 *
 * @return {stringPresetOrPluginType} - new preset or plugin
 */
const removeEmptyOption = (presetOrPlugin: presetOrPluginType) =>
  Object.keys(presetOrPlugin[1] || {}).length === 0
    ? presetOrPlugin[0]
    : presetOrPlugin;

export default {
  presetOrPlugin: <C: {}>(
    type: 'plugin' | 'preset',
    presetsOrPlugins: ?stringPresetOrPluginType,
    newPresetsOrPluginsCallback: C,
  ): stringPresetOrPluginType => {
    const newPresetsOrPlugins = [...(presetsOrPlugins || [])];

    Object.keys(newPresetsOrPluginsCallback).forEach((name: $Keys<C>) => {
      const index = newPresetsOrPlugins.findIndex(
        (presetOrPlugin: presetOrPluginType | string) =>
          standardizeName(type, presetOrPlugin) ===
            standardizeName(type, name) ||
          standardizeName(type, presetOrPlugin[0]) ===
            standardizeName(type, name),
      );

      if (index === -1) {
        newPresetsOrPlugins.push(
          removeEmptyOption(newPresetsOrPluginsCallback[name]([name, {}])),
        );
        return;
      }

      newPresetsOrPlugins[index] = removeEmptyOption(
        newPresetsOrPluginsCallback[name](
          newPresetsOrPlugins[index] instanceof Array
            ? newPresetsOrPlugins[index]
            : [newPresetsOrPlugins[index], {}],
        ),
      );
    });

    return newPresetsOrPlugins;
  },
};
