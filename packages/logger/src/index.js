// @flow

import React from 'react';
import { render } from 'ink';

import Logger, { type propsType } from './components';

type eventType = $PropertyType<propsType, 'event'>;
type messagesType = $PropertyType<propsType, 'messages'>;

type loggerType = {|
  [eventType]: (...messages: messagesType) => void,
|};

type cacheType = {
  render: typeof render,
  instance?: $Call<typeof render>,
};

export const cache: cacheType = {
  render,
};

/**
 * @param {string} name - logger name
 * @param {eventType} event - logger event
 *
 * @return {Function} - logger function
 */
const buildLog = (name: string, event: eventType) => (
  ...messages: messagesType
) => {
  if (cache.instance)
    cache.instance.rerender(
      <Logger name={name} event={event} messages={messages} />,
    );
  else
    cache.instance = cache.render(
      <Logger name={name} event={event} messages={messages} />,
      { patchConsole: false },
    );
};

/**
 * @param {string} name - logger name
 *
 * @return {loggerType} - logger functions
 */
export default (name: string): loggerType => ({
  start: buildLog(name, 'start'),
  stop: buildLog(name, 'stop'),
  success: buildLog(name, 'success'),
  error: buildLog(name, 'error'),
  info: buildLog(name, 'info'),
  warn: buildLog(name, 'warn'),
  log: buildLog(name, 'log'),
  debug: buildLog(name, 'debug'),
});
