// @flow

import watchman from 'fb-watchman';

export type respType = {|
  warning?: string,
  watch?: mixed,
  relative_path?: mixed,
|};

export type watcherType = (type: string, options: mixed) => Promise<respType>;

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
 * @return {watcherType} - watcher object
 */
export default (): watcherType => {
  const client = new watchman.Client();

  return (type: string, options: mixed) =>
    new Promise((resolve, reject) => {
      client[type](options, handler(resolve, reject));
    });
};
