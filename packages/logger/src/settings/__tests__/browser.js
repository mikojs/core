/**
 * remove when chalk support browser
 * https://github.com/chalk/chalk/issues/300
 *
 * @flow
 */

import browser from '../browser';

test('browser chalk', () => {
  browser.log.print('message');
});
