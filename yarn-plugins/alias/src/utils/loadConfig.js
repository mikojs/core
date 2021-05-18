export default () =>
  [
    () => require('@yarnpkg/plugin-config'),
    () => require('@mikojs/yarn-plugin-config'),
    () => ({}),
  ].reduce((result, getConfig) => {
    try {
      return result || getConfig();
    } catch (e) {
      return result;
    }
  }, undefined);
