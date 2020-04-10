// @flow

/**
 * @example
 * getComand('yarn install')
 *
 * @param {string} command - command string
 *
 * @return {Array} - command array
 */
export default (command: string): $ReadOnlyArray<$ReadOnlyArray<string>> => {
  let hasStarter: number = 0;

  return command.split(/ /).reduce(
    (
      result: $ReadOnlyArray<$ReadOnlyArray<string>>,
      key: string,
    ): $ReadOnlyArray<$ReadOnlyArray<string>> => {
      const [lastResult] = result.slice(-1);

      if (key === '&&') return [...result, []];

      if (hasStarter !== 0) {
        if (/['"]$/.test(key)) hasStarter -= 1;

        return [
          ...result.slice(0, -1),
          [...lastResult.slice(0, -1), `${lastResult.slice(-1)[0]} ${key}`],
        ];
      }

      if (/^['"]/.test(key) && !/['"]$/.test(key)) hasStarter += 1;

      return [...result.slice(0, -1), [...lastResult, key]];
    },
    [[]],
  );
};
