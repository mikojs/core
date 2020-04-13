// @flow

import { type commandsType } from './getCommands';

export const QUOTATION_START = /^['"]/;
export const QUOTATION_END = /['"]$/;

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
        if (QUOTATION_END.test(key)) hasQuotation -= 1;

        return [
          ...result.slice(0, -1),
          [...lastResult.slice(0, -1), `${lastResult.slice(-1)[0]} ${key}`],
        ];
      }

      if (QUOTATION_START.test(key) && !QUOTATION_END.test(key))
        hasQuotation += 1;

      return [...result.slice(0, -1), [...lastResult, key]];
    },
    [[]],
  );
};
