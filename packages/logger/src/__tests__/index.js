// @flow

import logger from '../index';

jest.mock(
  'chalk',
  () => (
    texts: $ReadOnlyArray<string>,
    ...keys: $ReadOnlyArray<string>
  ): string =>
    texts.reduce(
      (result: string, text: string, index: number): string =>
        `${result}${text}${keys[index] || ''}`,
      '',
    ),
);

describe('logger', () => {
  test.each`
    name         | prefix | color
    ${'log'}     | ${' '} | ${'gray'}
    ${'succeed'} | ${'✔'} | ${'green'}
    ${'fail'}    | ${'✖'} | ${'red'}
    ${'warn'}    | ${'⚠'} | ${'yellow'}
    ${'info'}    | ${'ℹ'} | ${'blue'}
    ${'aaa'}     | ${' '} | ${'gray'}
  `(
    'use $name function',
    ({
      name,
      prefix,
      color,
    }: {|
      name: string,
      prefix: string,
      color: string,
    |}) => {
      const mockLog = jest.fn();

      logger('test', {
        [name]: mockLog,
      })[name]('message');

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        `{${color} ${prefix} {bold test}} message`,
      );
    },
  );

  test('use optional logger', () => {
    const mockLog = jest.fn();

    logger('test', mockLog)
      .log('messageA')
      .log('messageB');
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith(`{gray   {bold test}} messageA`);
    expect(mockLog).toHaveBeenCalledWith(`{gray   {bold test}} messageB`);
  });
});
