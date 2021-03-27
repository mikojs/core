// @flow

import path from 'path';

import generateFiles from '../generateFiles';

jest.mock('@mikojs/utils/lib/requireModule', () =>
  jest.fn().mockReturnValue({ key: 'value' }),
);

test('generate files', () => {
  expect(generateFiles()).toEqual([
    path.resolve('./node_modules/.cache/@mikojs/miko/key.js'),
  ]);
});
