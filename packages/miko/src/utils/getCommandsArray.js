// @flow

import { type commandsType } from './getCommands';

export const QUOTATION_START = /^['"]/;
export const QUOTATION_END = /['"]$/;
const QUOTATION_ALL = /['"]/g;

/**
 * @param {string} command - command string
 *
 * @return {commandsType} - commands array
 */
export default (command: string): commandsType => {
  const quotationCache = [];

  return command.split(/ /).reduce(
    (result: commandsType, key: string): commandsType => {
      const [lastResult] = result.slice(-1);
      const [quotationStart] = key.match(QUOTATION_START) || [];

      if (key === '&&' && quotationCache.length === 0) return [...result, []];

      if (quotationStart) quotationCache.push(quotationStart);

      if (quotationCache.length !== 0) {
        const [lastKey] = lastResult.slice(-1);
        const allQuotations = key.match(QUOTATION_ALL);

        if (key.match(QUOTATION_END) && allQuotations)
          allQuotations.forEach((quotation: string, index: number) => {
            if (quotationStart && index === 0) return;

            if (quotationCache.slice(-1)[0] === quotation) quotationCache.pop();
            else quotationCache.push(quotation);
          });

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
