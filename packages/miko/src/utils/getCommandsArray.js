// @flow

import { type commandsType } from './getCommands';

export const QUOTATION_START = /^['"]/;
export const QUOTATION_END = /['"]$/;
const QUOTATION_START_ALL = /^['"]+/;
const QUOTATION_END_ALL = /['"]+$/;

/**
 * @example
 * getComandsArray('yarn install')
 *
 * @param {string} command - command string
 *
 * @return {commandsType} - commands array
 */
export default (command: string): commandsType => {
  let quotationCount: number = 0;

  return command.split(/ /).reduce(
    (result: commandsType, key: string): commandsType => {
      const [lastResult] = result.slice(-1);
      const [quotationStart] = key.match(QUOTATION_START_ALL) || [];
      const [quotationEnd] = key.match(QUOTATION_END_ALL) || [];

      if (key === '&&' && quotationCount === 0) return [...result, []];

      if (quotationStart) quotationCount += quotationStart.length;

      if (quotationCount !== 0) {
        const [lastKey] = lastResult.slice(-1);

        if (quotationEnd) quotationCount -= quotationEnd.length;

        if (QUOTATION_START.test(lastKey))
          return [
            ...result.slice(0, -1),
            [...lastResult.slice(0, -1), `${lastKey} ${key}`],
          ];
      }

      return [...result.slice(0, -1), [...lastResult, key]];
    },
    [[]],
  );
};
