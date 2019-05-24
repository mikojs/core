// @flow

import { SERVER_QUESTIONS } from '../server';

test('server store', () => {
  expect(SERVER_QUESTIONS[1].when({ useServer: true })).toBeTruthy();
});
