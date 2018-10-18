// @flow

import logger from '../logger';

describe.each`
  name         | prefix | color
  ${'log'}     | ${' '} | ${'gray'}
  ${'succeed'} | ${'✔'} | ${'green'}
  ${'fail'}    | ${'✖'} | ${'red'}
  ${'warn'}    | ${'⚠'} | ${'yellow'}
  ${'info'}    | ${'ℹ'} | ${'blue'}
  ${'aaa'}     | ${' '} | ${'gray'}
`(
  'logger',
  ({
    name,
    prefix,
    color,
  }: {
    name: string,
    prefix: string,
    color: string,
  }) => {
    it(name, () => {
      const mockLog = jest.fn();

      logger('test', {
        [name]: {
          print: mockLog,
        },
      })[name]('message');

      expect(mockLog).toHaveBeenCalledTimes(1);
      expect(mockLog).toHaveBeenCalledWith(
        `{${color} ${prefix} {bold test}} message`,
      );
    });
  },
);

test('default settings work', () => {
  const logs = logger('test');

  Object.keys(logs).forEach((key: string) => {
    logs[key]('message');
  });
});
