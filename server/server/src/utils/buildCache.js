// @flow

export type optionsType = {|
  dev?: boolean,
  build?: boolean,
  port?: number,
|};

type eventNameType = 'build' | 'run' | 'watch';
type eventNamesType = $ReadOnlyArray<eventNameType> | eventNameType;
type callbackType = (options: optionsType) => Promise<void> | void;

type cacheType = {|
  eventNames: eventNamesType,
  callback: callbackType,
|};

export type returnType = {|
  on: (
    eventNames: eventNamesType,
    callback: callbackType,
  ) => $Diff<returnType, {| run: mixed |}>,
  run: (eventName: eventNameType, options: optionsType) => Promise<void>,
|};

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - cache functions
 */
export default (): returnType => {
  const cache = [];
  const events = {
    on: (eventNames: eventNamesType, callback: callbackType): typeof events => {
      cache.push({ eventNames, callback });

      return events;
    },
  };

  return {
    ...events,
    run: (eventName: eventNameType, options: optionsType) =>
      cache
        .filter(({ eventNames }: cacheType) =>
          eventNames instanceof Array
            ? eventNames.includes(eventName)
            : eventNames === eventName,
        )
        .reduce(
          (result: Promise<void>, { callback }: cacheType) =>
            result.then(() => callback(options)),
          Promise.resolve(),
        ),
  };
};
