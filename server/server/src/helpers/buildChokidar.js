// @flow

type cacheType = {|
  dir: string | RegExp | $ReadOnlyArray<string> | $ReadOnlyArray<RegExp>,
  // eslint-disable-next-line flowtype/no-mutable-array
  events: Array<$ReadOnlyArray<mixed>>,
|};

type watcherType = {|
  on: (...argu: $ReadOnlyArray<mixed>) => watcherType,
|};

export type returnType = {|
  init: (
    dir: string,
  ) => {
    on: (
      ...argu: $ReadOnlyArray<mixed>
    ) => $Call<$PropertyType<returnType, 'init'>, string>,
  },
  run: () => void,
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
 * buildWatchFiles()
 *
 * @return {returnType} - watch files functions
 */
export default (): returnType => {
  const cache: cacheType = {
    dir: '.',
    events: [[['add', 'change'], removeFileCache]],
  };
  const events = {
    on: (
      ...argu: $ReadOnlyArray<mixed>
    ): $Call<$PropertyType<returnType, 'init'>, string> => {
      cache.events.push(argu);

      return events;
    },
  };

  return {
    init: (
      dir: $PropertyType<cacheType, 'dir'>,
    ): $Call<$PropertyType<returnType, 'init'>, string> => {
      cache.dir = dir;

      return events;
    },
    run: () => {
      cache.events.reduce(
        (result: watcherType, argu: $ReadOnlyArray<mixed>) =>
          !(argu[0] instanceof Array)
            ? result.on(...argu)
            : argu[0].reduce(
                (subResult: watcherType, key: string) =>
                  subResult.on(key, ...argu.slice(1)),
                result,
              ),
        require('chokidar').watch(cache.dir, {
          ignoreInitial: true,
        }),
      );
    },
  };
};
