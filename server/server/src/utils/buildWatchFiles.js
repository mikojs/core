// @flow

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
const removeFileCache = (filePath: string) => {
  if (!filePath || !/\.js$/.test(filePath)) return;

  delete require.cache[filePath];
};

/**
 * @example
 * buildWatchFiles()
 *
 * @return {returnType} - watch files functions
 */
export default (): returnType => {
  const cache = {
    dir: '.',
    events: [
      ['add', removeFileCache],
      ['change', removeFileCache],
    ],
  };

  /**
   * @example
   * on()
   *
   * @param {Array} argu - watch event and callback
   *
   * @return {object} - on object
   */
  const on = (
    ...argu: $ReadOnlyArray<mixed>
  ): $Call<$PropertyType<returnType, 'init'>, string> => {
    cache.events.push(argu);

    return { on };
  };

  return {
    init: (dir: string): $Call<$PropertyType<returnType, 'init'>, string> => {
      cache.dir = dir;

      return { on };
    },
    run: () => {
      cache.events.reduce(
        (result: watcherType, argu: $ReadOnlyArray<mixed>) =>
          result.on(...argu),
        require('chokidar').watch(cache.dir, {
          ignoreInitial: true,
        }),
      );
    },
  };
};
