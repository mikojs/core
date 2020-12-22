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

type cacheType = {|
  ...propsType,
  render: typeof render,
  run: () => void,
  instance?: $Call<typeof render>,
|};

type loggerCacheType = {|
  init: (initialCache: $Shape<cacheType>) => void,
  getInstance: () => $PropertyType<cacheType, 'instance'>,
  build: (name: string) => buildType,
|};

const cache: cacheType = {
  loading: {},
  messages: [],
  render,

  /** */
  run: () => {
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

export default ({
  /**
   * @param {cacheType} initialCache - initial cache
   */
  init: (initialCache: $Shape<cacheType>) => {
    Object.keys(initialCache).forEach((key: string) => {
      cache[key] = initialCache[key];
    });
  },

  /**
   * @return {any} - ink instance
   */
  getInstance: (): $PropertyType<cacheType, 'instance'> => cache.instance,

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
      cache.loading = {
        ...cache.loading,
        [name]: message,
      };
      cache.run();
    },

    /** */
    stop: () => {
      if (!cache.loading[name]) return;

      delete cache.loading[name];
      cache.loading = { ...cache.loading };
      cache.run();
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

      cache.messages = [
        ...cache.messages,
        {
          id: cache.messages.length.toString(),
          name: logName,
          event: event === 'debug' ? 'log' : event,
          message,
        },
      ];
      cache.run();
    },
  }),
}: loggerCacheType);
