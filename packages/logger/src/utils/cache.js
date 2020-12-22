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

type cacheType = {|
  ...propsType,
  render: typeof render,
  run: () => void,
  build: (name: string) => buildType,
  instance?: $Call<typeof render>,
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
     *
     * @return {Function} - log function
     */
    buildLog: (event: eventType) => (message: string) => {
      if (
        event === 'debug' &&
        !(process.env.DEBUG && new RegExp(process.env.DEBUG).test(name))
      )
        return;

      cache.messages = [
        ...cache.messages,
        {
          id: cache.messages.length.toString(),
          name,
          event: event === 'debug' ? 'log' : event,
          message,
        },
      ];
      cache.run();
    },
  }),
};

export default cache;
