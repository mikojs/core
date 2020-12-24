// @flow

import React from 'react';
import { render } from 'ink';

import handleMessage, { type messageType } from './handleMessage';

import Logger, { type propsType } from 'components';

export type eventType =
  | 'debug'
  | $PropertyType<
      $ElementType<$PropertyType<propsType, 'messages'>, number>,
      'event',
    >;

export type buildType = {|
  start: (message: messageType) => void,
  stop: () => void,
  buildLog: (
    event: eventType,
    name?: string,
  ) => (...messages: $ReadOnlyArray<messageType>) => void,
|};

type cacheType = {|
  ...propsType,
  names: {| [string]: string |},
  render: typeof render,
  run: () => void,
  getColor: (name: string) => string,
  instance?: $Call<typeof render>,
|};

type loggerCacheType = {|
  init: (initialCache: $Shape<cacheType>) => void,
  getInstance: () => $PropertyType<cacheType, 'instance'>,
  build: (name: string) => buildType,
|};

const cache: cacheType = {
  loading: {},
  names: {},
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

  /**
   * @param {string} name - log name
   *
   * @return {string} - color string
   */
  getColor: (name: string): string => {
    cache.names[name] =
      cache.names[name] ||
      `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return cache.names[name];
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
    start: (message: messageType) => {
      cache.loading = {
        ...cache.loading,
        [name]: handleMessage(message),
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
      ...messages: $ReadOnlyArray<messageType>
    ) => {
      if (
        event === 'debug' &&
        !(process.env.DEBUG && new RegExp(process.env.DEBUG).test(logName))
      )
        return;

      messages.forEach((message: messageType) => {
        handleMessage(message)
          .split(/\n/)
          .forEach((str: string) => {
            cache.messages = [
              ...cache.messages,
              {
                id: cache.messages.length.toString(),
                name: logName,
                color: cache.getColor(logName),
                event: event === 'debug' ? 'log' : event,
                message: str,
              },
            ];
          });
      });
      cache.run();
    },
  }),
}: loggerCacheType);
