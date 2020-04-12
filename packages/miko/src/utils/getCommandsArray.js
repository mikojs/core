// @flow

import { type commandsType } from './getCommands';

/**
 * @example
 * getComandsArray('yarn install')
 *
 * @param {string} command - command string
 *
 * @return {commandsType} - commands array
 */
export default (command: string): commandsType => {
  let hasStarter: number = 0;

  return command.split(/ /).reduce(
    (result: commandsType, key: string): commandsType => {
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
