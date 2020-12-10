// @flow

import EventEmitter from 'events';
import stream from 'stream';

import React, { type Node as NodeType } from 'react';
import { render } from 'ink';

import Logger, { type stateType } from 'components';

type eventType = $Keys<$ElementType<stateType, string>>;
type logType = (mesage: string) => void;
type loggerType = {|
  [eventType]: logType,
  dom: NodeType,
  render: typeof render,
|};

const inputStream = new stream.Writable();
const outputStream = new stream.Readable();
let cache: NodeType;

outputStream.pipe(inputStream);
outputStream.setEncoding('utf8');

/**
 * @param {string} name - logger name
 * @param {eventType} event - event name
 *
 * @return {logType} - log function
 */
const build = (name: string, event: eventType) => (message: string) => {
  inputStream.write(JSON.stringify({ name, event, message }));
};

/**
 * @param {string} name - logger name
 *
 * @return {loggerType} - logger object
 */
export default (name: string): loggerType => ({
  success: build(name, 'success'),
  fail: build(name, 'fail'),
  // FIXME should use stream
  dom: cache || <Logger events={new EventEmitter()} />,
  // FIXME should only render once
  render,
});
