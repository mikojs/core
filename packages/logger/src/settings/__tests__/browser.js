/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 *
 * @flow
 */

import browser from '../browser';

test('browser chalk', () => {
  Object.keys(browser).forEach((key: string) => {
    browser[key].print('message');
    browser[key].print('{cyan {bold message}}');
  });
});
