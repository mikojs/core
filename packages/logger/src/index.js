// @flow

import loggerCache, {
  type eventType,
  type buildType,
} from './utils/loggerCache';
import { type messageType } from './utils/handleMessage';

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
  const { start, stop, buildLog } = loggerCache.build(name.replace(/:.*$/, ''));

  return {
    start,
    stop,

    /**
     * @param {messageType} message - log message
     */
    success: (message: messageType) => {
      stop();
      buildLog('success')(message);
    },

    /**
     * @param {messageType} message - log message
     */
    error: (message: messageType) => {
      stop();
      buildLog('error')(message);
    },

    info: buildLog('info'),
    warn: buildLog('warn'),
    log: buildLog('log'),
    debug: buildLog('debug', name),
  };
};
