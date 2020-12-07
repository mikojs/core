// @flow

import EventEmitter from 'events';

export type eventType = 'success' | 'fail';

type logType = (mesage: string) => void;
type logsType = {|
  [eventType]: logType,
|};

const events = new EventEmitter();

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
});
