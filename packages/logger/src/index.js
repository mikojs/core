// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type propsType } from './components';

type logsType = $PropertyType<propsType, 'logs'>;
type eventType = $PropertyType<
  $ElementType<$ElementType<logsType, string>, number>,
  'event',
>;
type loggerType = {|
  [eventType]: (message: string) => void,
|};

export const cache: {|
  logs: logsType,
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
    const loading = event !== 'start' ? cache.logs[name]?.loading : message;
    const messages = cache.logs[name]?.messages || [];

    cache.logs = {
      ...cache.logs,
      [name]: {
        loading: ['success', 'error'].includes(event) ? false : loading,
        messages:
          event === 'start' ? messages : [...messages, { event, message }],
      },
    };

    if (cache.instance) cache.instance.rerender(<Logger logs={cache.logs} />);
    else cache.instance = cache.render(<Logger logs={cache.logs} />);
  },
};

/**
 * @param {string} name - logger name
 *
 * @return {loggerType} - logger
 */
export default (name: string): loggerType =>
  ['start', 'success', 'error', 'info', 'warn', 'log'].reduce(
    (result: loggerType, event: eventType) => ({
      ...result,

      /**
       * @param {string} message - log message
       */
      [event]: (message: string) => {
        cache.add(name, event, message);
      },
    }),
    {},
  );
