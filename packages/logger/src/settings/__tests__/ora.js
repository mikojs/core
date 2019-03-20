// @flow

import logger from '../../index';

const logs = logger('ora', 'ora').init('init');

describe.each`
  name         | expected
  ${'start'}   | ${'{gray {bold ora}} message'}
  ${'succeed'} | ${'{green {bold ora}} message'}
  ${'fail'}    | ${'{red {bold ora}} message'}
  ${'warn'}    | ${'{yellow {bold ora}} message'}
  ${'info'}    | ${'{blue {bold ora}} message'}
`('ora settings', ({ name, expected }: { name: string, expected: string }) => {
  describe(name, () => {
    test(`run ${name}`, () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;

      if (name === 'fail')
        expect(() => {
          throw logs[name]('message');
        }).toThrow('process exit');
      else logs[name]('message');

      expect(mockLog).toHaveBeenCalledWith(expected);
    });

    test(`run log after ${name}`, () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;

      if (name === 'fail') {
        expect(() => {
          throw logs[name]('message');
        }).toThrow('process exit');
        expect(mockLog).toHaveBeenCalledWith(expected);
      } else {
        logs[name]('message').log('log');

        expect(mockLog).toHaveBeenCalledWith(expected);
        expect(mockLog).toHaveBeenCalledWith('  {gray {bold ora}} log');
      }
    });
  });
});

test('can not run log when ora is spinning', () => {
  const mockLog = jest.fn();

  global.console.log = mockLog;
  logs.start('isSpinning').log('log');

  expect(mockLog).toHaveBeenCalledTimes(1);
});
