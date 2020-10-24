// @flow

import path from 'path';

import testingServer, { type fetchResultType } from '../testingServer';

jest.mock('@mikojs/router/lib/utils/buildRouter', () =>
  jest.requireActual('@mikojs/router/src/utils/buildRouter'),
);

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

  afterAll(() => {
    testingServer.close();
  });
});
