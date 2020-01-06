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

/**
 * @example
 * removeEmptyOption(['pluginName'])
 *
 * @param {presetOrPluginType} presetOrPlugin - preset or plugin
 *
 * @return {stringPresetOrPluginType} - new preset or plugin
 */
const removeEmptyOption = (presetOrPlugin: presetOrPluginType) =>
  Object.keys(presetOrPlugin[1]).length === 0
    ? presetOrPlugin[0]
    : presetOrPlugin;

export default {
  presetOrPlugin: <C: {}>(
    presetsOrPlugins: ?stringPresetOrPluginType,
    newPresetsOrPluginsCallback: C,
  ): stringPresetOrPluginType => {
    const newPresetsOrPlugins = [...(presetsOrPlugins || [])];

    Object.keys(newPresetsOrPluginsCallback).forEach((name: $Keys<C>) => {
      const index = newPresetsOrPlugins.findIndex(
        (presetOrPlugin: presetOrPluginType | string) =>
          presetOrPlugin === name || presetOrPlugin[0] === name,
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
