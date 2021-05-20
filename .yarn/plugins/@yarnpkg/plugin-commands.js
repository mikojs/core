module.exports = {
  name: '@yarnpkg/plugin-commands',
  factory: () => {
    try {
      return require('@mikojs/commands');
    } catch (e) {
      return {};
    }
  },
};
