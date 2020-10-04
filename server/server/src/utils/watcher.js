// @flow

import watchman from 'fb-watchman';

export type dataType = {|
  exists: boolean,
  filePath: string,
|};

export type callbackType = (data: $ReadOnlyArray<dataType>) => void;

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
 * @param {string} folderPath - folder path
 * @param {callbackType} callback - handle files function
 *
 * @return {Function} - close client
 */
export default async (
  folderPath: string,
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

  callback([{ exists: true, filePath: folderPath }]);

  return () => client.end();
};