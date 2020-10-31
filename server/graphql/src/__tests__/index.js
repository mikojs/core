// @flow

import path from 'path';

import testingServer, { type fetchResultType } from '../testingServer';

describe('router', () => {
  beforeAll(async () => {
    await testingServer.run(path.resolve(__dirname, './__ignore__'));
  });

  test('fetch', async () => {
    expect(
      await testingServer
        .fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              {
                version
              }
            `,
          }),
        })
        .then((res: fetchResultType) => res.json()),
    ).toEqual({
      data: {
        version: '1.0.0',
      },
    });
  });

  afterAll(() => {
    testingServer.close();
  });
});
