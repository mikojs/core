// @flow

import watchman from 'fb-watchman';
import outputFileSync from 'output-file-sync';
import cryptoRandomString from 'crypto-random-string';

type fileType = {|
  name: string,
  exists: boolean,
|};

/**
 * @param {string} foldePath - folder path
 * @param {string} cacheFilePath - cache file path
 *
 * @return {Promise} - cancel watch event
 */
export default async (
  foldePath: string,
  cacheFilePath: string,
): Promise<() => Promise<void>> => {
  const client = new watchman.Client();
  const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });

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
          {
            warning,
            ...resp
          }: {| warning?: string, watch?: mixed, relative_path?: mixed |},
        ) => {
          const { warn } = console;

          if (warning) warn(warning);

          if (err) reject(err);
          else resolve(resp);
        },
      );
    });

  await promiseClient('capabilityCheck', {
    optional: [],
    required: ['relative_root'],
  });

  const { watch, relative_path: relativePath } = await promiseClient(
    'command',
    ['watch-project', foldePath],
  );

  promiseClient('command', [
    'subscribe',
    watch,
    hash,
    {
      ...(!relativePath
        ? {}
        : {
            relative_root: relativePath,
          }),
      expression: ['allof', ['match', '*.js']],
      fields: ['name', 'exists'],
    },
  ]);

  client.on(
    'subscription',
    ({
      subscription,
      files,
    }: {|
      subscription: string,
      files: $ReadOnlyArray<fileType>,
    |}) => {
      if (subscription !== hash) return;

      outputFileSync(
        cacheFilePath,
        `module.exports = (req, res) => {
  res.end(req.url);
};`,
      );
    },
  );

  return async () => {
    await promiseClient('command', ['unsubscribe', foldePath, hash]);
  };
};
