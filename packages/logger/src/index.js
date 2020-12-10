// @flow

import EventEmitter from 'events';

import React from 'react';
import { render } from 'ink';

import Logger, { type stateType } from 'components';

type eventType = $Keys<$ElementType<stateType, string>>;
type logType = (mesage: string) => void;
type logsType = {|
  [eventType]: logType,
  init: () => Promise<void>,
|};

const events = new EventEmitter();
let isInit: boolean;

/**
 * @param {string} name - logger name
 * @param {eventType} event - event
 *
 * @return {logType} - logger function
 */
const emit = (name: string, event: eventType) => (message: string) => {
  events.emit('update', { name, event, message });
};

/**
 * @param {string} name - logger name
 *
 * @return {logsType} - logger functions
 */
export default (name: string): logsType => ({
  success: emit(name, 'success'),
  fail: emit(name, 'fail'),

  /**
   * @return {Promise} - init
   */
  init: () =>
    new Promise(resolve => {
      events.on('end', resolve);

      if (!isInit) render(<Logger events={events} />);
      else events.emit('end');

      isInit = true;
    }),
});
