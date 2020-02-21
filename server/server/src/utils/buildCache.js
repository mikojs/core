// @flow

export type optionsType = {|
  dev?: boolean,
  port?: number,
  dir?: string,
  filePath?: string,
|};

type eventsType = $ReadOnlyArray<string> | string;
type callbackType = (options: optionsType) => Promise<void> | void;

type cacheType = {|
  events: eventsType,
  callback: callbackType,
|};

export type returnType = {|
  add: (events: eventsType, callback: callbackType) => void,
  run: (eventName: string, options: optionsType) => Promise<void>,
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
      events: ['add', 'change'],
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
    run: (eventName: string, options: optionsType) =>
      cache
        .filter(
          ({ events }: cacheType) =>
            events === eventName || !events.includes(eventName),
        )
        .reduce(
          (result: Promise<void>, { callback }: cacheType) =>
            result.then(() => callback(options)),
          Promise.resolve(),
        ),
  };
};
