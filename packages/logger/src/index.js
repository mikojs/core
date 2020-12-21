// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type messageType, type propsType } from './components';

type eventType = $PropertyType<messageType, 'event'>;
type loggerType = {|
  [eventType]: (message: string) => void,
  debug: (message: string) => void,
|};

export const cache: {|
  ...propsType,
  render: typeof render,
  build: (name: string, event: eventType) => (message: string) => void,
  instance?: $Call<typeof render>,
|} = {
  loading: {},
  messages: [],
  render,

  /**
   * @param {string} name - logger name
   * @param {eventType} event - log event
   *
   * @return {loggerType} - log function
   */
  build: (name: string, event: eventType) => (message: string) => {
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
export default (name: string): loggerType => {
  const logName = name.replace(/:.*$/, '');

  return {
    start: cache.build(logName, 'start'),
    success: cache.build(logName, 'success'),
    error: cache.build(logName, 'error'),
    info: cache.build(logName, 'info'),
    warn: cache.build(logName, 'warn'),
    log: cache.build(logName, 'log'),

    /**
     * @param {string} message - log message
     */
    debug: (message: string) => {
      if (process.env.DEBUG && new RegExp(process.env.DEBUG).test(name))
        cache.build(name, 'log')(message);
    },
  };
};
