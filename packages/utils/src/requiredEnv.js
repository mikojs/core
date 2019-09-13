// @flow

/**
 * @example
 * requiredEnv('test')
 *
 * @param {Array} envNames - env names to check
 */
export default (...envNames: $ReadOnlyArray<string>) => {
  const result = envNames.filter((envName: string) => !process.env[envName]);

  if (result.length !== 0)
    throw new Error(`those env variables are required: ${result.join(', ')}`);
};
