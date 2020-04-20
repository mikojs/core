// @flow

import createLogger from '../createLogger';

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

describe('createLogger', () => {
  test.each`
    name         | prefix | color
    ${'log'}     | ${' '} | ${'gray'}
    ${'succeed'} | ${'✔'} | ${'green'}
    ${'fail'}    | ${'✖'} | ${'red'}
    ${'warn'}    | ${'⚠'} | ${'yellow'}
    ${'info'}    | ${'ℹ'} | ${'blue'}
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
      const mapName =
        {
          succeed: 'log',
          fail: 'error',
        }[name] || name;

      global.console[mapName] = mockLog;
      createLogger('test')[name]('message');

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        `{${color} ${prefix} }{${color} {bold test}} message`,
      );
    },
  );

  test('use optional createLogger', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;
    createLogger('test').start('messageA').log('messageB');

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith(
      `{gray   }{gray {bold test}} messageA`,
    );
    expect(mockLog).toHaveBeenCalledWith(
      `{gray   }{gray {bold test}} messageB`,
    );
  });
});
