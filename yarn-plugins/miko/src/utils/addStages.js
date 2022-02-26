import Miko from '../commands/Miko';

import buildUsage from './buildUsage';

export default (name, hooks) => {
  const paths = Object.keys(hooks).map(hookName => [hookName, name]);

  return {
    hooks: Object.keys(hooks).reduce(
      (result, hookName) => ({
        ...result,
        [`${hookName}:${name}`]: hooks[hookName],
      }),
      hooks,
    ),
    commands: [
      class Custom extends Miko {
        static paths = paths;

        static usage = buildUsage(paths);
      },
    ],
  };
};
