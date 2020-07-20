// @flow

import EventEmitter from 'events';

export type eventsType =
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

export type callbackType = (
  event: eventsType,
  data: {|
    name: string,
    extension: string,
    filePath: string,
    pathname: string,
  |},
) => void;

/**
 * @param {callbackType} callback - events callback function
 *
 * @return {EventEmitter} - events
 */
export default (callback: callbackType): EventEmitter => {
  const events = new EventEmitter();

  [
    'add',
    'addDir',
    'change',
    'unlink',
    'unlinkDir',
    'ready',
    'raw',
    'error',
  ].forEach((event: eventsType) => {
    events.on(event, callback);
  });

  return events;
};
