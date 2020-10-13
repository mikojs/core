// @flow

import testing from '../../testing';

import func from './foo';

/** */
export default () => {
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
};
