// @flow

import handleErrorMessage from '../handleErrorMessage';

test('handle error message', () => {
  expect(
    handleErrorMessage('server', new Error('Cannot find module main.js')),
  ).toMatch(/Could not find a valid build./);
});
