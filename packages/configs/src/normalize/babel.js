// @flow

type presetOrPluginType = string | [string, {}];

export default {
  presetOrPlugin: <R: $ReadOnlyArray<presetOrPluginType>, C: {}>(
    presetsOrPlugins: R,
    newPresetsOrPluginsCallback: C,
  ): R => {
    const newPresetsOrPlugins = [...presetsOrPlugins];

    Object.keys(newPresetsOrPluginsCallback).forEach((name: $Keys<C>) => {
      const index = newPresetsOrPlugins.findIndex(
        (presetOrPlugin: presetOrPluginType) =>
          presetOrPlugin === name || presetOrPlugin[0] === name,
      );

      if (index === -1) {
        newPresetsOrPlugins.push(newPresetsOrPluginsCallback[name]([name]));
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
