// @flow

import path from 'path';

import testing from '../../testing';

import build from './build';

/** */
export default () => {
  describe('dev mode', () => {
    const func = build(path.resolve(__dirname, './folder/foo'));

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
};
