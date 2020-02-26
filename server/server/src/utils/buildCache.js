// @flow

export type optionsType = {|
  dev?: boolean,
  build?: boolean,
  port?: number,
|};

type eventType = 'build' | 'run' | 'watch';
type eventsType = $ReadOnlyArray<eventType> | eventType;
type callbackType = (options: optionsType) => Promise<void> | void;

type cacheType = {|
  events: eventsType,
  callback: callbackType,
|};

export type returnType = {|
  on: (
    events: eventsType,
    callback: callbackType,
  ) => {|
    on: $PropertyType<returnType, 'on'>,
  |},
  run: (eventName: eventType, options: optionsType) => Promise<void>,
|};

/**
 * @example
 * buildCache()
 *
 * @return {returnType} - cache functions
 */
export default (): returnType => {
  const cache = [];

  /**
   * @example
   * on('add', () => {})
   *
   * @param {eventsType} events - event names
   * @param {Function} callback - callback funcrion
   *
   * @return {object} - on object
   */
  const on = (
    events: eventsType,
    callback: callbackType,
  ): {| on: $PropertyType<returnType, 'on'> |} => {
    cache.push({ events, callback });

    return {
      on,
    };
  };

  return {
    on,
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
