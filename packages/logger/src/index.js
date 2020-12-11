// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type eventType, type propsType } from './components';

export const cache: {|
  logs: $PropertyType<propsType, 'logs'>,
  render: typeof render,
  add: (name: string, event: eventType, message: string) => void,
  instance?: $Call<typeof render>,
|} = {
  logs: {},
  render,

  /**
   * @param {string} name - logger name
   * @param {eventType} event - log event
   * @param {string} message - log message
   */
  add: (name: string, event: eventType, message: string) => {
    cache.logs = {
      ...cache.logs,
      [name]: [...(cache.logs[name] || []), { event, message }],
    };

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
    cache.add(name, 'success', message);
  },

  /**
   * @param {string} message - log fail message
   */
  fail: (message: string) => {
    cache.add(name, 'fail', message);
  },
});
