// @flow

import { type commandsType } from './getCommands';

const quotationStart = /^['"]/;
const quotationEnd = /['"]$/;

/**
 * @example
 * getComandsArray('yarn install')
 *
 * @param {string} command - command string
 *
 * @return {commandsType} - commands array
 */
export default (command: string): commandsType => {
  let hasQuotation: number = 0;

  return command.split(/ /).reduce(
    (result: commandsType, key: string): commandsType => {
      const [lastResult] = result.slice(-1);

      if (key === '&&') return [...result, []];

      if (hasQuotation !== 0) {
        if (quotationEnd.test(key)) hasQuotation -= 1;

        return [
          ...result.slice(0, -1),
          [...lastResult.slice(0, -1), `${lastResult.slice(-1)[0]} ${key}`],
        ];
      }

      if (quotationStart.test(key) && !quotationEnd.test(key))
        hasQuotation += 1;

      return [...result.slice(0, -1), [...lastResult, key]];
    },
    [[]],
  );
};
