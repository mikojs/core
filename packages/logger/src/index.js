// @flow

import cache, { type eventType, type buildType } from './utils/cache';

type loggerType = {|
  ...$Diff<buildType, {| buildLog: mixed |}>,
  [eventType]: $Call<$PropertyType<buildType, 'buildLog'>, eventType>,
|};

/**
 * @param {string} name - logger name
 *
 * @return {loggerType} - logger
 */
export default (name: string): loggerType => {
  const { start, stop, buildLog } = cache.build(name.replace(/:.*$/, ''));

  return {
    start,
    stop,

    /**
     * @param {string} message - log message
     */
    success: (message: string) => {
      stop();
      buildLog('success')(message);
    },

    /**
     * @param {string} message - log message
     */
    error: (message: string) => {
      stop();
      buildLog('error')(message);
    },

    info: buildLog('info'),
    warn: buildLog('warn'),
    log: buildLog('log'),
    debug: buildLog('debug'),
  };
};
