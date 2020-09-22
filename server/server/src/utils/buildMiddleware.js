// @flow

import path from 'path';

import debug from 'debug';
import watchman from 'fb-watchman';
import outputFileSync from 'output-file-sync';
import cryptoRandomString from 'crypto-random-string';

import { type callbackType } from '../types';

type fileType = {|
  name: string,
  exists: boolean,
|};

const debugLog = debug('server:buildMiddleware');

/**
 * @param {string} foldePath - folder path
 * @param {string} cacheFilePath - cache file path
 * @param {callbackType} callback - callback function to handle file
 */
export default async (
  foldePath: string,
  cacheFilePath: string,
  callback: callbackType,
) => {
  const client = new watchman.Client();
  const hash = cryptoRandomString({ length: 10, type: 'base64' });

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
        files.reduce((result: string, { name, exists }: fileType): string => {
          const filePath = path.resolve(foldePath, name);
          const pathname = name
            .replace(/\.js$/, '')
            .replace(/index/, '')
            .replace(/^/, '/')
            .replace(/\[([^[\]]*)\]/g, ':$1');

          delete require.cache[filePath];

          return callback({
            filePath,
            exists,
            pathname,
          });
        }, ''),
      );
    },
  );
};
