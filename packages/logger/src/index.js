// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type eventType, type propsType } from './components';

type logsType = $PropertyType<propsType, 'logs'>;
type callbackType = (prevLogs: logsType) => logsType;

const cache: {|
  logs: logsType,
  update: (callback: callbackType) => void,
  rerender?: $PropertyType<$Call<typeof render>, 'rerender'>,
|} = {
  logs: {},

  /**
   * @param {callbackType} callback - update logs callback
   */
  update: (callback: callbackType) => {
    cache.logs = callback(cache.logs);

    if (cache.rerender) cache.rerender(<Logger logs={cache.logs} />);
    else cache.rerender = render(<Logger logs={cache.logs} />).rerender;
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
