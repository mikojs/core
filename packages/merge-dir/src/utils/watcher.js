// @flow

import debug from 'debug';
import watchman from 'fb-watchman';
import cryptoRandomString from 'crypto-random-string';

export type dataType = {|
  exists: boolean,
  name: string,
|};

export type eventType = 'dev' | 'build' | 'run';
export type callbackType = (data: $ReadOnlyArray<dataType>) => void;

type respType = {|
  warning?: string,
  watch?: mixed,
  relative_path?: mixed,
  subscription?: string,
  files: $ReadOnlyArray<dataType>,
|};
type resolveType = (resp: respType) => void;
type rejectType = (err: Error) => void;
type handlerType = (
  resolve: resolveType,
  reject: rejectType,
) => (err: Error, resp: respType) => void;

const debugLog = debug('merge-dir:watcher');

/**
 * @param {resolveType} resolve - promise resolve function
 * @param {rejectType} reject - promise reject function
 *
 * @return {Function} - handler function for watchman client
 */
export const handler: handlerType = (
  resolve: resolveType,
  reject: rejectType,
) => (err: Error, resp: respType) => {
  const { warn } = console;

  debugLog({ err, resp });

  if (resp?.warning) warn(resp.warning);

  if (err) reject(err);
  else resolve(resp);
};

/**
 * @param {string} folderPath - folder path
 * @param {eventType} event - watcher event type
 * @param {callbackType} callback - handle files function
 *
 * @return {Function} - close client
 */
export default async (
  folderPath: string,
  event: eventType,
  callback: callbackType,
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

  const { watch, relative_path: relativePath } = await promiseClient(
    'command',
    ['watch-project', folderPath],
  );
  const sub = {
    expression: ['allof', ['match', '*.js']],
    fields: ['exists', 'name'],
    relative_root: relativePath,
  };

  debugLog({ watch, relativePath });

  switch (event) {
    case 'dev':
      const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });

      await promiseClient('command', ['subscribe', watch, hash, sub]);
      client.on('subscription', ({ subscription, files }: respType) => {
        if (subscription !== hash) return;

        callback(files);
      });
      break;

    case 'build':
      const { files } = await promiseClient('command', ['query', watch, sub]);

      callback(files);
      break;

    default:
      break;
  }

  return () => client.end();
};
