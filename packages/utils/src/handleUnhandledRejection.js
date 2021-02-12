// @flow

import { ExecutionEnvironment } from 'fbjs';

/**
 * @param {any} error - any error message
 */
const defaultErrorCallback = (error: mixed) => {
  throw error;
};

/**
 * @param {boolean} isBrowser - is browser or not
 * @param {Function} callback - use to handle UnhandledRejection
 */
export default (
  isBrowser?: boolean = ExecutionEnvironment.canUseEventListeners,
  callback?: (error: mixed) => void = defaultErrorCallback,
) => {
  if (isBrowser) window.addEventListener('unhandledRejection', callback);
  else process.on('unhandledRejection', callback);
};
