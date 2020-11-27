// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import testing from '../../testing';

import build from './build';

const folderPath = path.resolve(__dirname, './folder/foo');
const func = build(folderPath);

/** */
export default () => {
  describe('dev mode', () => {
    beforeAll(async () => {
      (await testing.ready())();
    });

    test.each`
      pathname
      ${'/'}
      ${'/foo'}
      ${'/:id'}
      ${'/bar'}
      ${'/bar/foo'}
      ${'/bar/bar'}
      ${'/baz'}
      ${'/baz/foo'}
      ${'/baz/bar'}
    `('get $pathname', ({ pathname }: {| pathname: string |}) => {
      expect(func(pathname)).toBe(pathname);
    });
  });

  test('build and run mode', async () => {
    testing.set('build');
    testing.use<[], string>(
      folderPath,
      undefined,
      () =>
        `module.exports = require('fbjs/lib/emptyFunction').thatReturnsArgument;`,
    );

    (await testing.ready())();
    testing.set('run');

    expect(
      testing.use<[string], string>(
        folderPath,
        undefined,
        emptyFunction,
      )('test'),
    ).toBe('test');
  });
};
