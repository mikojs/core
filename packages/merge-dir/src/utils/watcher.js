// @flow

import { emptyFunction } from 'fbjs';
import watchman from 'fb-watchman';
import cryptoRandomString from 'crypto-random-string';

import createLogger from '@mikojs/logger';

export type dataType = {|
  exists: boolean,
  name: string,
|};

export type eventType = 'dev' | 'build' | 'run';
export type callbackType = (data: $ReadOnlyArray<dataType>) => void;
export type closeType = () => void;

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

const logger = createLogger('@mikojs/merge-dir:watcher');

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
  logger.debug({ err, resp });

  if (resp?.warning) logger.warn(resp.warning);

  if (err) reject(err);
  else resolve(resp);
};

/**
 * @param {string} hash - hash key
 * @param {callbackType} callback - handle files function
 *
 * @return {Function} - subscription function
 */
export const buildSubscription = (
  hash: string,
  callback: callbackType,
): ((resp: respType) => void) => ({ subscription, files }: respType) => {
  if (subscription === hash) callback(files);
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
): Promise<closeType> => {
  if (event === 'run') return emptyFunction;

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

  logger.debug({ watch, relativePath });
  callback((await promiseClient('command', ['query', watch, sub])).files);

  if (event === 'dev') {
    const hash = cryptoRandomString({ length: 10, type: 'alphanumeric' });

    await promiseClient('command', ['subscribe', watch, hash, sub]);
    client.on('subscription', buildSubscription(hash, callback));
  }

  return () => client.end();
};
