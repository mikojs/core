// @flow

/**
 * @example
 * getExecCommands(['lerna', 'babel'], {})
 *
 * @param {Array} keys - commands keys
 * @param {object} prevConfig - prev config
 * @param {object} rootConfig - root config
 *
 * @return {Array} - commands
 */
const getExecCommands = (
  [key, ...otherKeys]: $ReadOnlyArray<string>,
  prevConfig: {},
  rootConfig?: {} = prevConfig,
): ?$ReadOnlyArray<string> => {
  Object.keys(prevConfig).forEach((prevConfigKey: string) => {
    if (/:/.test(prevConfigKey)) {
      const [newKey, ...otherNewKeys] = prevConfigKey.split(/:/);

      if (!prevConfig[newKey]) prevConfig[newKey] = {};

      prevConfig[newKey][otherNewKeys.join(':')] = prevConfig[prevConfigKey];
      delete prevConfig[prevConfigKey];
    }
  });

  if (!prevConfig[key]) return null;

  if (otherKeys.length !== 0)
    return getExecCommands(otherKeys, prevConfig[key], rootConfig);

  return prevConfig[key]?.reduce(
    (result: $ReadOnlyArray<string>, command: string) => [
      ...result,
      ...(/^exec:/.test(command)
        ? getExecCommands(command.split(/:/).slice(1), rootConfig) ||
          (() => {
            throw new Error(`Can not find \`${command}\` in the config`);
          })()
        : [command]),
    ],
    [],
  );
};

export default getExecCommands;
