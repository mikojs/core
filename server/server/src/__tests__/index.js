// @flow

import testingServer, { type fetchResultType } from '../testingServer';
import middleware from './__ignore__/middleware';

describe('server', () => {
  beforeAll(async () => {
    await testingServer.run(middleware);
  });

  test.each`
    pathname
    ${'/'}
    ${'/foo'}
  `('fetch $pathname', async ({ pathname }: {| pathname: string |}) => {
    expect(
      await testingServer
        .fetch(pathname)
        .then((res: fetchResultType) => res.text()),
    ).toBe(pathname);
  });

  afterAll(async () => {
    await new Promise(resolve => {
      testingServer.close(resolve);
    });
  });
});
