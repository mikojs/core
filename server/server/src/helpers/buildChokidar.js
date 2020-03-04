// @flow

import { invariant } from 'fbjs';

type dirOrPathType =
  | string
  | RegExp
  | $ReadOnlyArray<string>
  | $ReadOnlyArray<RegExp>;
type eventNamesType = string | $ReadOnlyArray<string>;
type callbackType = (filePath: string) => void;

type watcherType = {|
  watch: (
    dirOrPath: dirOrPathType,
    options: {| ignoreInitial: boolean |},
  ) => watcherType,
  add: (dirOrPath: dirOrPathType) => watcherType,
  on: (
    eventNames: eventNamesType,
    callback: (filePath: string) => void,
  ) => watcherType,
  close: () => Promise<void>,
|};

export type returnType = {|
  add: (
    dirOrPath: dirOrPathType,
  ) => $Diff<returnType, {| watch: mixed, watcher: mixed |}>,
  on: (
    eventNames: eventNamesType,
    callback: callbackType,
  ) => $Diff<returnType, {| watch: mixed, watcher: mixed |}>,
  watcher: () => ?watcherType,
  watch: () => void,
|};

/**
 * @example
 * removeFileCache(filePath)
 *
 * @param {string} filePath - file path to remove cache
 */
export const removeFileCache = (filePath: string) => {
  if (!/\.js$/.test(filePath)) return;

  delete require.cache[filePath];
};

/**
 * @example
 * buildChokidar()
 *
 * @return {returnType} - chokidar functions
 */
export default (): returnType => {
  const cache = {
    isInitialized: false,
    watcher: null,
    events: [],
  };
  const events = {
    add: (dirOrPath: dirOrPathType): typeof events => {
      if (cache.isInitialized)
        cache.events.push((watcher: watcherType) => watcher.add(dirOrPath));
      else {
        cache.isInitialized = true;
        cache.events.unshift((watcher: watcherType) =>
          watcher.watch(dirOrPath, {
            ignoreInitial: true,
          }),
        );
      }

      return events;
    },
    on: (eventNames: eventNamesType, callback: callbackType): typeof events => {
      (eventNames instanceof Array ? eventNames : [eventNames]).forEach(
        (eventName: string) => {
          cache.events.push((watcher: watcherType) =>
            watcher.on(eventName, callback),
          );
        },
      );

      return events;
    },
  };

  events.on(['add', 'change'], removeFileCache);

  return {
    ...events,
    watcher: () => cache.watcher,
    watch: () => {
      invariant(
        cache.isInitialized,
        'You must add a folder, a file path at least. It can be `string`, `regexp` or `array`.',
      );

      cache.watcher = cache.events.reduce(
        (
          result: watcherType,
          callback: (watcher: watcherType) => watcherType,
        ) => callback(result),
        require('chokidar'),
      );
    },
  };
};
