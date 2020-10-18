// @flow

import path from 'path';

import testingServer, {
  type fetchResultType,
} from '@mikojs/server/lib/testingServer';

import router from '../index';

describe('router', () => {
  beforeAll(async () => {
    await testingServer.run(router(path.resolve(__dirname, './__ignore__')));
  });

  test.each`
    url      | expected
    ${'/'}   | ${'/ {}'}
    ${'/id'} | ${'/id {"id":"id"}'}
  `(
    'fetch $url',
    async ({ url, expected }: {| url: string, expected: string |}) => {
      expect(
        await testingServer
          .fetch(url)
          .then((res: fetchResultType) => res.text()),
      ).toBe(expected);
    },
  );

  afterAll(() => {
    testingServer.close();
  });
});
