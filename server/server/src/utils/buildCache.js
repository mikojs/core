// @flow

export type optionsType = {|
  dev?: boolean,
  build?: boolean,
  port?: number,
  dir?: string,
  filePath?: string,
|};

type eventType = 'build' | 'run' | 'watch' | 'watch:add' | 'watch:change';
type eventsType = $ReadOnlyArray<eventType> | eventType;
type callbackType = (options: optionsType) => Promise<void> | void;

type cacheType = {|
  events: eventsType,
  callback: callbackType,
|};

export type returnType = {|
  add: (events: eventsType, callback: callbackType) => void,
  run: (eventName: eventType, options: optionsType) => Promise<void>,
|};

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - cache functions
 */
export default (): returnType => {
  const cache = [
    {
      events: ['watch:add', 'watch:change'],
      callback: ({ filePath }: optionsType) => {
        if (!filePath || !/\.js$/.test(filePath)) return;

        delete require.cache[filePath];
      },
    },
  ];

  return {
    add: (events: eventsType, callback: callbackType) => {
      cache.push({ events, callback });
    },
    run: (eventName: eventType, options: optionsType) =>
      cache
        .filter(({ events }: cacheType) =>
          events instanceof Array
            ? events.includes(eventName)
            : events === eventName,
        )
        .reduce(
          (result: Promise<void>, { callback }: cacheType) =>
            result.then(() => callback(options)),
          Promise.resolve(),
        ),
  };
};
