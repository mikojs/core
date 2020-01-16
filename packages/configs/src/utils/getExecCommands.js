// @flow

/**
 * @example
 * getExecCommands(['lerna', 'babel'], {})
 *
 * @param {Array} keys - commands keys
 * @param {object} prevConfig - prev config
 *
 * @return {Array} - commands
 */
const getExecCommands = (
  [key, ...otherKeys]: $ReadOnlyArray<string>,
  prevConfig: {},
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

  if (otherKeys.length === 0) return prevConfig[key];

  return getExecCommands(otherKeys, prevConfig[key]);
};

export default getExecCommands;
