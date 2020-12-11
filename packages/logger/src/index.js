// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type eventType, type propsType } from './components';

type logsType = $PropertyType<propsType, 'logs'>;
type callbackType = (prevLogs: logsType) => logsType;

export const cache: {|
  logs: logsType,
  render: typeof render,
  update: (callback: callbackType) => void,
  instance?: $Call<typeof render>,
|} = {
  logs: {},
  render,

  /**
   * @param {callbackType} callback - update logs callback
   */
  update: (callback: callbackType) => {
    cache.logs = callback(cache.logs);

    if (cache.instance) cache.instance.rerender(<Logger logs={cache.logs} />);
    else cache.instance = cache.render(<Logger logs={cache.logs} />);
  },
};

/**
 * @param {string} name - logger name
 *
 * @return {object} - logger
 */
export default (
  name: string,
): ({|
  [eventType]: (message: string) => void,
|}) => ({
  /**
   * @param {string} message - log success message
   */
  success: (message: string) => {
    cache.update((prevLogs: logsType) => ({
      ...prevLogs,
      [name]: {
        ...prevLogs[name],
        success: [...(prevLogs[name]?.success || []), message],
      },
    }));
  },

  /**
   * @param {string} message - log fail message
   */
  fail: (message: string) => {
    cache.update((prevLogs: logsType) => ({
      ...prevLogs,
      [name]: {
        ...prevLogs[name],
        fail: [...(prevLogs[name]?.fail || []), message],
      },
    }));
  },
});
