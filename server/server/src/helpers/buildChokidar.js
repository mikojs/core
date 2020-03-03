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
  add: (dirOrPath: dirOrPathType) => $Diff<returnType, {| run: mixed |}>,
  on: (
    eventNames: eventNamesType,
    callback: callbackType,
  ) => $Diff<returnType, {| run: mixed |}>,
  run: () => watcherType,
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
 * @return {returnType} - watch files functions
 */
export default (): returnType => {
  const cache = [];
  let isInitialized: boolean = false;

  const events = {
    add: (dirOrPath: dirOrPathType): typeof events => {
      if (isInitialized)
        cache.push((watcher: watcherType) => watcher.add(dirOrPath));
      else {
        isInitialized = true;
        cache.unshift((watcher: watcherType) =>
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
          cache.push((watcher: watcherType) => watcher.on(eventName, callback));
        },
      );

      return events;
    },
  };

  events.on(['add', 'change'], removeFileCache);

  return {
    ...events,
    run: (): watcherType => {
      invariant(
        isInitialized,
        'You must add a folder, a file path at least. It can be `string`, `regexp` or `array`.',
      );

      return cache.reduce(
        (
          result: watcherType,
          callback: (watcher: watcherType) => watcherType,
        ) => callback(result),
        require('chokidar'),
      );
    },
  };
};
