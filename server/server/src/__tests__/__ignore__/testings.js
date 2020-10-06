// @flow

import path from 'path';

import { requireModule } from '@mikojs/utils';

import { type middlewareType } from '../../index';
import testingServer, { type fetchResultType } from '../../testingServer';

/** */
export default () => {
  beforeAll(async () => {
    await testingServer.run(
      requireModule<middlewareType<void>>(path.resolve(__dirname, './foo')),
    );
  });

  test.each`
    pathname
    ${'/'}
    ${'/foo'}
    ${'/bar'}
    ${'/bar/foo'}
    ${'/bar/bar'}
  `('fetch $pathname', async ({ pathname }: {| pathname: string |}) => {
    expect(
      await testingServer
        .fetch(pathname)
        .then((res: fetchResultType) => res.text()),
    ).toBe(pathname);
  });

  afterAll(
    () =>
      new Promise(resolve => {
        testingServer.close(resolve);
      }),
  );
};
