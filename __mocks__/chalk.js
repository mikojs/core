// @flow

import { emptyFunction } from 'fbjs';

/**
 * @example
 * chalk`{green test}`
 *
 * @param {Array} texts - text array
 * @param {Array} keys - key array
 *
 * @return {string} - chalk string
 */
const chalk = (
  texts: $ReadOnlyArray<string>,
  ...keys: $ReadOnlyArray<string>
): string =>
  texts.reduce(
    (result: string, text: string, index: number): string =>
      `${result}${text}${keys[index] || ''}`,
    '',
  );

chalk.blue = emptyFunction.thatReturnsArgument;
chalk.green = emptyFunction.thatReturnsArgument;
chalk.yellow = emptyFunction.thatReturnsArgument;
chalk.red = emptyFunction.thatReturnsArgument;
chalk.gray = emptyFunction.thatReturnsArgument;
chalk.cyan = emptyFunction.thatReturnsArgument;
chalk.grey = emptyFunction.thatReturnsArgument;

export default chalk;
