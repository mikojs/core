// @flow

import EventEmitter from 'events';

import { type eventsType, type callbackType } from './readFiles';

type optionsType = {|
  dev: callbackType,
  prod: callbackType,
|};

export type returnType = (type: testingType) => EventEmitter;

type testingType = 'dev' | 'prod';

const callbacks = [];

/**
 * @param {optionsType} options - build testing options
 *
 * @return {returnType} - testing function
 */
export default ({ dev, prod }: optionsType): returnType => {
  callbacks.push((type: testingType, watcher: EventEmitter) => {
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
      watcher.on(event, type === 'dev' ? dev : prod);
    });
  });

  return (type: testingType): EventEmitter => {
    const watcher = new EventEmitter();

    callbacks.forEach(
      (callback: (type: testingType, watcher: EventEmitter) => void) =>
        callback(type, watcher),
    );

    return watcher;
  };
};
