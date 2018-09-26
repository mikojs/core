// @flow

export default (
  texts: $ReadOnlyArray<string>,
  ...keys: $ReadOnlyArray<string>
): string =>
  texts.reduce(
    (result: string, text: string, index: number): string =>
      `${result}${text}${keys[index] || ''}`,
    '',
  );
