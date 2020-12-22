// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type messageType, type propsType } from 'components';

export type eventType = 'debug' | $PropertyType<messageType, 'event'>;

export type buildType = {|
  start: (message: string) => void,
  stop: () => void,
  buildLog: (event: eventType) => (message: string) => void,
|};

type loggerCacheType = {|
  ...propsType,
  render: typeof render,
  run: () => void,
  build: (name: string) => buildType,
  instance?: $Call<typeof render>,
|};

const loggerCache: loggerCacheType = {
  loading: {},
  messages: [],
  render,

  /** */
  run: () => {
    if (loggerCache.instance)
      loggerCache.instance.rerender(
        <Logger
          loading={loggerCache.loading}
          messages={loggerCache.messages}
        />,
      );
    else
      loggerCache.instance = loggerCache.render(
        <Logger
          loading={loggerCache.loading}
          messages={loggerCache.messages}
        />,
      );
  },

  /**
   * @param {string} name - logger name
   *
   * @return {buildType} - logger functions
   */
  build: (name: string) => ({
    /**
     * @param {string} message - log message
     */
    start: (message: string) => {
      loggerCache.loading = {
        ...loggerCache.loading,
        [name]: message,
      };
      loggerCache.run();
    },

    /** */
    stop: () => {
      if (!loggerCache.loading[name]) return;

      delete loggerCache.loading[name];
      loggerCache.loading = { ...loggerCache.loading };
      loggerCache.run();
    },

    /**
     * @param {eventType} event - log event
     *
     * @return {Function} - log function
     */
    buildLog: (event: eventType) => (message: string) => {
      if (
        event === 'debug' &&
        !(process.env.DEBUG && new RegExp(process.env.DEBUG).test(name))
      )
        return;

      loggerCache.messages = [
        ...loggerCache.messages,
        {
          id: loggerCache.messages.length.toString(),
          name,
          event: event === 'debug' ? 'log' : event,
          message,
        },
      ];
      loggerCache.run();
    },
  }),
};

export default loggerCache;
