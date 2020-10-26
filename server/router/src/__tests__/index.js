// @flow

import path from 'path';

import testingServer, { type fetchResultType } from '../testingServer';

describe('router', () => {
  beforeAll(async () => {
    await testingServer.run(path.resolve(__dirname, './__ignore__'));
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

  test('not found', async () => {
    expect(
      await testingServer
        .fetch('/a/notFound')
        .then((res: fetchResultType) => res.status),
    ).toBe(404);
  });

  afterAll(() => {
    testingServer.close();
  });
});
