// @flow

import logger from '../..';

import browser from '../browser';

test('log', () => {
  const logs = logger('test');

  Object.keys(logs).forEach((key: string) => {
    if (key === 'fail')
      expect(() => {
        throw logs[key]('message');
      }).toThrow('process exit');
    else logs[key]('message');
  });
});

/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 */
test('browser', () => {
  Object.keys(browser).forEach((key: string) => {
    browser[key].print('message');
    browser[key].print('{cyan {bold message}}');
  });
});
