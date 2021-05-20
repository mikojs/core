export default () =>
  [
    () => require('@yarnpkg/plugin-commands'),
    () => ({}),
  ].reduce((result, getPlugin) => {
    try {
      return result || getPlugin();
    } catch (e) {
      return result;
    }
  }, undefined);
