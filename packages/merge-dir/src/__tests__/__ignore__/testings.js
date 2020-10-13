// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import testing from '../../testing';

import build from './build';

const folderPath = path.resolve(__dirname, './folder/foo');

/** */
export default () => {
  describe('dev mode', () => {
    const func = build(folderPath);

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
    testing.updateTools({ type: 'build' });
    testing.set(
      folderPath,
      () =>
        `module.exports = require('fbjs/lib/emptyFunction').thatReturnsArgument;`,
    );
    (await testing.ready())();
    testing.updateTools({ type: 'run' });

    expect(testing.get(testing.set(folderPath, emptyFunction))('test')).toBe(
      'test',
    );
  });
};
