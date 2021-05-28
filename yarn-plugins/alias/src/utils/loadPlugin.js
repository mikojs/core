import path from 'path';

export default () =>
  [
    () => require('@yarnpkg/plugin-commands'),
    () => require(
      path.resolve('./.yarn/plugins/@yarnpkg/plugin-commands'),
    ).factory(),
    () => ({}),
  ].reduce((result, getPlugin) => {
    try {
      const plugin = getPlugin();

      return result || plugin.default || plugin;
    } catch (e) {
      return result;
    }
  }, undefined);
