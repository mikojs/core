import Miko from './commands/Miko';

export default {
  commands: [Miko],

  // custom
  addStages: (name, hooks) => ({
    hooks: Object.keys(hooks).reduce(
      (result, hookName) => ({
        ...result,
        [`${hookName}:${name}`]: hooks[hookName],
      }),
      hooks,
    ),
    commands: [
      class Custom extends Miko {
        static paths = Object.keys(hooks).map(hookName => [hookName, name]);
      },
    ],
  }),
};
