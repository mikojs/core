export default () =>
  [
    () => require('@yarnpkg/plugin-config'),
    () => ({}),
  ].reduce((result, getConfig) => {
    try {
      return result || getConfig();
    } catch (e) {
      return result;
    }
  }, undefined);
