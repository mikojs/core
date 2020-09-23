// @flow

import watchman from 'fb-watchman';
import outputFileSync from 'output-file-sync';

/**
 * @param {string} foldePath - folder path
 * @param {string} cacheFilePath - cache file path
 *
 * @return {Promise} - cancel watch event
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
      client[type](
        options,
        (
          err: Error,
          resp: {| warning?: string, watch?: mixed, relative_path?: mixed |},
        ) => {
          const { warn } = console;

          if (resp?.warning) warn(resp.warning);

          if (err) reject(err);
          else resolve(resp);
        },
      );
    });

  await promiseClient('capabilityCheck', {
    optional: [],
    required: ['relative_root'],
  });
  await promiseClient('command', ['watch-project', foldePath]);

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
