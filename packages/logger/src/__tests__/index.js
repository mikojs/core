// @flow

import logger from '..';

describe.each`
  name         | prefix | color
  ${'log'}     | ${' '} | ${'gray'}
  ${'succeed'} | ${'✔'} | ${'green'}
  ${'fail'}    | ${'✖'} | ${'red'}
  ${'warn'}    | ${'⚠'} | ${'yellow'}
  ${'info'}    | ${'ℹ'} | ${'blue'}
  ${'aaa'}     | ${' '} | ${'gray'}
`(
  'use default print',
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

test('not find settings', () => {
  expect(Object.keys(logger('test', 'not find settings')).length).toBe(0);
});

test('show json message', () => {
  const mockLog = jest.fn();
  const message = {
    obj: {
      key: 'value',
    },
  };

  logger('test', {
    log: {
      print: mockLog,
    },
  }).log(message);

  expect(mockLog).toHaveBeenCalledTimes(1);
  expect(mockLog).toHaveBeenCalledWith(JSON.stringify(message, null, 2));
});
