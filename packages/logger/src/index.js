// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type messageType, type propsType } from './components';

type eventType = $PropertyType<$ElementType<messageType, number>, 'event'>;
type loggerType = {|
  [eventType]: (message: string) => void,
|};

export const cache: {|
  ...propsType,
  render: typeof render,
  add: (name: string, event: eventType, message: string) => void,
  instance?: $Call<typeof render>,
|} = {
  loading: {},
  messages: [],
  render,

  /**
   * @param {string} name - logger name
   * @param {eventType} event - log event
   * @param {string} message - log message
   */
  add: (name: string, event: eventType, message: string) => {
    if (event === 'start')
      cache.loading = {
        ...cache.loading,
        [name]: message,
      };
    else {
      if (['success', 'error'].includes(event) && cache.loading[name])
        delete cache.loading[name];

      cache.messages = [
        ...cache.messages,
        {
          id: cache.messages.length.toString(),
          name,
          event,
          message,
        },
      ];
    }

    if (cache.instance)
      cache.instance.rerender(
        <Logger loading={cache.loading} messages={cache.messages} />,
      );
    else
      cache.instance = cache.render(
        <Logger loading={cache.loading} messages={cache.messages} />,
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
