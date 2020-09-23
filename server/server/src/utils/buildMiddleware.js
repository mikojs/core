// @flow

import watchman from 'fb-watchman';
import outputFileSync from 'output-file-sync';

type respType = {| warning?: string, watch?: mixed, relative_path?: mixed |};

/**
 * @param {Function} resolve - promise resolve function
 * @param {Function} reject - promise reject function
 *
 * @return {Function} - handler function for watchman client
 */
export const handler = (
  resolve: (resp: respType) => void,
  reject: (err: Error) => void,
) => (err: Error, resp: respType) => {
  const { warn } = console;

  if (resp?.warning) warn(resp.warning);

  if (err) reject(err);
  else resolve(resp);
};

/**
 * @param {string} foldePath - folder path
 * @param {string} cacheFilePath - cache file path
 *
 * @return {Function} - close client
 */
export default async (
  foldePath: string,
  cacheFilePath: string,
): Promise<() => void> => {
  const client = new watchman.Client();

  /**
   * @param {string} type - client command type
   * @param {any} options - client command options
   *
   * @return {Promise} - promise client
   */
  const promiseClient = (type: string, options: mixed) =>
    new Promise((resolve, reject) => {
      client[type](options, handler(resolve, reject));
    });

  await promiseClient('capabilityCheck', {
    optional: [],
    required: ['relative_root'],
  });

  outputFileSync(
    cacheFilePath,
    `module.exports = (req, res) => {
  res.end(req.url);
};`,
  );

  return () => {
    client.end();
  };
};
