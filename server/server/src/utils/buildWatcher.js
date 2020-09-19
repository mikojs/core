// @flow

import crypto from 'crypto';

import watchman from 'fb-watchman';
import debug from 'debug';

type fileType = {|
  name: string,
  exists: boolean,
  type: 'f',
|};

type callbackType = (file: fileType) => void;

const debugLog = debug('server:bulidWatcher');

/**
 * @param {string} foldePath - folder path
 * @param {callbackType} callback - callback function to handle file
 */
export default async (foldePath: string, callback: callbackType) => {
  const client = new watchman.Client();
  const hash = crypto.createHash('md5').update('@mikojs/server').digest('hex');

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
          if (warning) debugLog(warning);

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
      fields: ['name', 'exists', 'type'],
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

      files.forEach(callback);
    },
  );
};
