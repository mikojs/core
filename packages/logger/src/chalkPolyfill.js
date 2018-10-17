/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 *
 * @flow
 */

import { ExecutionEnvironment } from 'fbjs';

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
): string =>
  strings.reduce(
    (result: string, text: string, index: number): string =>
      `${result}${text}${keys[index] || ''}`,
    '',
  );

export default (!ExecutionEnvironment.canUseEventListeners
  ? require('chalk')
  : browserChalk);
