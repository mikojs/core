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
    ${'/bar/foo'}
    ${'/bar/bar'}
  `('get $pathname', ({ pathname }: {| pathname: string |}) => {
    expect(func(pathname)).toBe(pathname);
  });

  afterAll(() => {
    close();
  });
};
