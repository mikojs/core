// @flow

/**
 * @example
 * chalk`{red text}`
 *
 * @param {Array} texts - string template text array
 * @param {Array} keys - string template key array
 *
 * @return {string} - chalk string
 */
export default (
  texts: $ReadOnlyArray<string>,
  ...keys: $ReadOnlyArray<string>
): string =>
  texts.reduce(
    (result: string, text: string, index: number): string =>
      `${result}${text}${keys[index] || ''}`,
    '',
  );
