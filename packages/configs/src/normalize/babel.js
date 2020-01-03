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
        newPresetsOrPlugins.push(newPresetsOrPluginsCallback[name]([name, {}]));
        return;
      }

      newPresetsOrPlugins[index] = newPresetsOrPluginsCallback[name](
        newPresetsOrPlugins[index] instanceof Array
          ? newPresetsOrPlugins[index]
          : [newPresetsOrPlugins[index], {}],
      );
    });

    return newPresetsOrPlugins;
  },
};
