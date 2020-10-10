// @flow

import testing from '../../testing';

import func from './foo';

let close: () => void;

/** */
export default () => {
  beforeAll(async () => {
    close = await testing.ready();
  });

  test.each`
    pathname
    ${'/'}
    ${'/foo'}
    ${'/bar'}
    ${'/foo/foo'}
    ${'/foo/bar'}
    ${'/baz'}
    ${'/baz/foo'}
    ${'/baz/bar'}
  `('get $pathname', ({ pathname }: {| pathname: string |}) => {
    expect(func(pathname)).toBe(pathname);
  });

  afterAll(() => {
    close();
  });
};
