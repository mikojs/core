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

  /**
   * @example
   * replaceQuotation('"test"')
   *
   * @param {string} str - replaced string
   *
   * @return {string} - new string
   */
  const replaceQuotation = (str: string) =>
    hasQuotation !== 0
      ? str
      : str.replace(quotationStart, '').replace(quotationEnd, '');

  return command.split(/ /).reduce(
    (result: commandsType, key: string): commandsType => {
      const [lastResult] = result.slice(-1);

      if (key === '&&') return [...result, []];

      if (hasQuotation !== 0) {
        if (quotationEnd.test(key)) hasQuotation -= 1;

        return [
          ...result.slice(0, -1),
          [
            ...lastResult.slice(0, -1),
            replaceQuotation(`${lastResult.slice(-1)[0]} ${key}`),
          ],
        ];
      }

      if (quotationStart.test(key) && !quotationEnd.test(key))
        hasQuotation += 1;

      return [...result.slice(0, -1), [...lastResult, replaceQuotation(key)]];
    },
    [[]],
  );
};
