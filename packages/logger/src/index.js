// @flow

import EventEmitter from 'events';

import React, { type Node as NodeType } from 'react';
import { render } from 'ink';

import Logger, { type stateType } from 'components';

type eventType = $Keys<$ElementType<stateType, string>>;
type logType = (mesage: string) => void;
type logsType = {|
  [eventType]: logType,
  dom: NodeType,
  render: typeof render,
|};

const events = new EventEmitter();
let cache: NodeType;

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
  dom: cache || <Logger events={events} />,
  // FIXME should only render once
  render,
});