// @flow

/**
 * FIXME:
 * Owing to jest coverage, can not remove index
 * Remove it after upgrading jest
 */
import logger from '../index';

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
  }: {|
    name: string,
    prefix: string,
    color: string,
  |}) => {
    test(name, () => {
      const mockLog = jest.fn();

      logger('test', {
        [name]: mockLog,
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
    log: mockLog,
  }).log(message);

  expect(mockLog).toHaveBeenCalledTimes(1);
  expect(mockLog).toHaveBeenCalledWith(JSON.stringify(message, null, 2));
});
