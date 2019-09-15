/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 *
 * @flow
 */

import { emptyFunction, ExecutionEnvironment } from 'fbjs';

import { mockChoice } from '@mikojs/utils';

/**
 * @example
 * browserChalk`test`
 *
 * @param {Array} strings - string array
 * @param {Array} keys - template keys
 *
 * @return {string} - new string
 */
const browserChalk = (
  strings: $ReadOnlyArray<string>,
  ...keys: $ReadOnlyArray<string>
) =>
  strings.reduce(
    (result: string, text: string, index: number) =>
      `${result}${text}${keys[index] || ''}`,
    '',
  );

export default mockChoice(
  ExecutionEnvironment.canUseEventListeners,
  emptyFunction.thatReturns(browserChalk),
  emptyFunction.thatReturns(require('chalk')),
);
