// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type messageType, type propsType } from 'components';

export type eventType = 'debug' | $PropertyType<messageType, 'event'>;

export type buildType = {|
  start: (message: string) => void,
  stop: () => void,
  buildLog: (event: eventType, name?: string) => (message: string) => void,
|};

type loggerCacheType = {|
  ...propsType,
  render: typeof render,
  run: () => void,
  instance?: $Call<typeof render>,
|};

type resultType = {|
  init: (initialCache: $Shape<loggerCacheType>) => void,
  getInstance: () => $PropertyType<loggerCacheType, 'instance'>,
  build: (name: string) => buildType,
|};

export default (((): resultType => {
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
  };

  return {
    /**
     * @param {loggerCacheType} initialCache - initial cache
     */
    init: (initialCache: $Shape<loggerCacheType>) => {
      Object.keys(initialCache).forEach((key: string) => {
        loggerCache[key] = initialCache[key];
      });
    },

    /**
     * @return {any} - ink instance
     */
    getInstance: (): $PropertyType<loggerCacheType, 'instance'> =>
      loggerCache.instance,

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
       * @param {string} logName - log name
       *
       * @return {Function} - log function
       */
      buildLog: (event: eventType, logName?: string = name) => (
        message: string,
      ) => {
        if (
          event === 'debug' &&
          !(process.env.DEBUG && new RegExp(process.env.DEBUG).test(logName))
        )
          return;

        loggerCache.messages = [
          ...loggerCache.messages,
          {
            id: loggerCache.messages.length.toString(),
            name: logName,
            event: event === 'debug' ? 'log' : event,
            message,
          },
        ];
        loggerCache.run();
      },
    }),
  };
})(): resultType);
