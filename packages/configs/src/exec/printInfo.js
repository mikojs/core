// @flow

/**
 * @example
 * printInfo({})
 *
 * @param {object} config - config
 * @param {Array} prevKeys - prev keys
 */
const printInfo = (config: {}, prevKeys?: $ReadOnlyArray<string> = []) => {
  const { log } = console;

  Object.keys(config).forEach((key: string) => {
    if (config[key] instanceof Array) log([...prevKeys, key].join(':'));
    else printInfo(config[key], [...prevKeys, key]);
  });
};

export default printInfo;
