// @flow

import { ExecutionEnvironment } from 'fbjs';

/**
 * @example
 * defaultErrorCallback('test')
 *
 * @param {any} error - any error message
 */
const defaultErrorCallback = (error: mixed) => {
  throw error;
};

/**
 * @example
 * handleUnhandledRejection()
 *
 * @param {Function} callback - use to handle UnhandledRejection
 *
 */
export default (callback?: (error: mixed) => void = defaultErrorCallback) => {
  if (ExecutionEnvironment.canUseEventListeners)
    window.addEventListener('unhandledRejection', callback);
  else process.on('unhandledRejection', callback);
};
