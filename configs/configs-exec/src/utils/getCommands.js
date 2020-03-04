// @flow

/**
 * @example
 * getCommands(['lerna', 'babel'], {})
 *
 * @param {Array} keys - commands keys
 * @param {object} prevConfig - prev config
 * @param {object} rootConfig - root config
 *
 * @return {Array} - commands
 */
const getCommands = (
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
    return getCommands(otherKeys, prevConfig[key], rootConfig);

  return prevConfig[key]?.reduce(
    (result: $ReadOnlyArray<string>, command: string) => [
      ...result,
      ...(/^exec:/.test(command)
        ? getCommands(command.split(/:/).slice(1), rootConfig) ||
          (() => {
            throw new Error(`Can not find \`${command}\` in the config`);
          })()
        : [command]),
    ],
    [],
  );
};

export default getCommands;
