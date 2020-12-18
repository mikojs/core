// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type messageType } from './components';

type eventType = $PropertyType<$ElementType<messageType, number>, 'event'>;
type loggerType = {|
  [eventType]: (message: string) => void,
|};

export const cache: {|
  messages: $ReadOnlyArray<messageType>,
  render: typeof render,
  add: (name: string, event: eventType, message: string) => void,
  instance?: $Call<typeof render>,
|} = {
  messages: [],
  render,

  /**
   * @param {string} name - logger name
   * @param {eventType} event - log event
   * @param {string} message - log message
   */
  add: (name: string, event: eventType, message: string) => {
    cache.messages = [
      ...cache.messages,
      {
        id: new Date().toString(),
        name,
        event,
        message,
      },
    ];
    /* TODO
    cache.logs = {
      ...cache.logs,
      [name]: {
        loading: ['success', 'error'].includes(event) ? false : loading,
        messages:
          event === 'start' ? messages : [...messages, { event, message }],
      },
    };
    */

    if (cache.instance)
      cache.instance.rerender(
        <Logger loading={{}} messages={cache.messages} />,
      );
    else
      cache.instance = cache.render(
        <Logger loading={{}} messages={cache.messages} />,
      );
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
